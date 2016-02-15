(function() {
  var body = d3.select("body")[0][0];
  var width = body.clientWidth;
  var height = window.innerHeight;
  var bubbleCount = 1024;
  var chargeValue = 500;
  var flipDelay = 10000;  // 10 seconds
  var widthOffset = width / 8;
  var heightOffset = height / 8;
  var nodes = d3.range(bubbleCount).map(generateBubble);
  var svg = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");

  var force = d3.layout.force()
    .gravity(0)
    .nodes(nodes)
    .size([width, height]);

  flipCharges();

  force.on("tick", tick);

  var radialGradient = svg.append("svg:defs")
    .append("svg:radialGradient")
      .attr("id", "gradient");

  radialGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#333");

  radialGradient.append("stop")
    .attr("offset", "85%")
    .attr("stop-color", "#444");

  radialGradient.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", "#111");

  var circles = svg.selectAll(".node")
    .data(nodes)
    .enter().append("svg:ellipse")
      .attr("rx", function(d) { return d.rx; })
      .attr("ry", function(d) { return d.ry; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", "url(#gradient)");

  function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }

  function collide(node) {
    var r = node.rx + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.rx + quad.point.rx;
        if (l < r) {
          l = (l - r) / l * 0.5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }

  function generateBubble(value, i) {
    if(i % 16 === 0) {
      return {
        x: getRandomInt(widthOffset, width - widthOffset),
        y: getRandomInt(heightOffset, height - heightOffset),
        rx: 0,
        ry: 0,
        fixed: true,
        charge: getRandomInt(0, 1) ? chargeValue : -chargeValue,
      };
    }

    var radius = getRandomInt(2, 16);
    return {
      x: getRandomInt(0, width),
      y: getRandomInt(0, height),
      rx: radius,
      ry: radius * (getRandomInt(8, 12) / 10),
      charge: 0,
      chargeDistance: 0,
    };
  }

  function flipCharges() {
    force.charge(function(d) {
      d.charge = -d.charge;
      return d.charge;
    });
    svg.transition()
      .delay(flipDelay)
      .each("end", flipCharges);
    force.start();
  }

  function tick(e) {
    var q = d3.geom.quadtree(nodes);
    var n = nodes.length;

    for(var i = 0 ; i < n ; i++) {
      q.visit(collide(nodes[i]));
    }

    svg.selectAll("ellipse")
      .attr("cx", function(d) {
        return Math.max(-d.rx, Math.min(width + d.rx, d.x));
      })
      .attr("cy", function(d) {
        return Math.max(-d.ry, Math.min(height + d.ry, d.y));
      });
  }

})();
