'use strict';

var scale = 15;
var halfScale = scale / 2;

function getSquare(x, y) {
  var square = new Path2D();
  square.rect(x - halfScale, y - halfScale, scale, scale);
  return square;
}

function getTriangle(x, y) {
  var triangle = new Path2D();
  triangle.moveTo(x + halfScale, y - halfScale);
  triangle.lineTo(x, y + halfScale);
  triangle.lineTo(x - halfScale, y - halfScale);
  triangle.closePath();
  return triangle;
}

function getCircle(x, y) {
  var circle = new Path2D();
  circle.arc(x, y, halfScale, 0, 2 * Math.PI);
  return circle;
}

function getPoint(x, y) {
  var point = new Path2D();
  point.arc(x, y, 1, 0, 2 * Math.PI);
  return point;
}

function getLine(x, y) {
  var line = new Path2D();
  line.moveTo(x - halfScale, y);
  line.lineTo(x + halfScale, y);
  return line;
}

function getCross(x, y) {
  var cross = new Path2D();
  cross.moveTo(x - halfScale, y);
  cross.lineTo(x + halfScale, y);
  cross.moveTo(x, y - halfScale);
  cross.lineTo(x, y + halfScale);
  return cross;
}

function getTCross(x, y) {
  var tCross = new Path2D();
  tCross.moveTo(x - halfScale, y);
  tCross.lineTo(x + halfScale, y);
  tCross.moveTo(x, y);
  tCross.lineTo(x, y + halfScale);
  return tCross;
}

function getAngle(x, y) {
  var angle = new Path2D();
  angle.moveTo(x - halfScale, y);
  angle.lineTo(x, y);
  angle.lineTo(x, y + halfScale);
  return angle;
}

function getItemIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function getItem(radius, theta) {
  var angle = (theta * 90 * Math.PI) / 180;
  if (Math.random() >= 0.5) {
    radius *= Math.random();
  }
  return {
    index: getItemIndex(shapes),
    angle: angle * Math.round(Math.random() * 4),
    x: scale * radius * Math.cos(angle),
    y: scale * radius * Math.sin(angle),
    radius: radius * Math.random(),
  };
}

function drawItem(context, item, rotation, style) {
  for (var a = 1; a <= rotation; a++) {
    context.save();
    context.strokeStyle = style;
    context.lineWidth = 1.5;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(a * Math.PI / (rotation / 2) * item.radius);
    context.translate(item.x, item.y);
    context.rotate(item.angle);
    context.scale(Math.random(), Math.random());
    context.stroke(shapes[item.index]);
    context.restore()
  }
}

function drawShapes(maxRotation) {
  if (!canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(16, 16, 16, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var maxBorder = 40;
  // Reduce size on mobile for performence
  if (window.innerWidth <= 500) {
    maxBorder = 10;
  }
  var border = Math.round(
    Math.random() * maxBorder + 10
  );

  for (var i = 0 ; i < border; i++) {
    var maxRadius = Math.random() * i;
    for (var j = 0 ; j < maxRadius; j++) {
      var item = getItem(maxRadius * Math.random() * i, j);
      drawItem(ctx, item, maxRotation, '#efefef');
    }
  }

  window.requestAnimationFrame(draw);
}

function drawBurst() {
  if (!canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(16, 16, 16, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0 ; i < 10; i++) {
    for (var j = 0 ; j < i; j++) {
      var item = getItem(i * j, j);
      drawItem(ctx, item, 50, '#efefef');
    }
  }

  window.requestAnimationFrame(draw);
}

var shapes = [
  getSquare(0, 0),
  getCircle(0, 0),
  getTriangle(0, 0),
  getLine(0, 0),
  getPoint(0, 0),
  getCross(0, 0),
  getTCross(0, 0),
  getAngle(0, 0),
]

var framesPerSecond = 10;
var burstStart = 5000;
var burstEnd = 0;
var canvas = document.getElementById('grid');
var content = document.getElementById('content');

function draw(deltaTime) {
  if (deltaTime > burstStart || deltaTime < burstEnd) {
    if (deltaTime > burstStart) {
      burstEnd = deltaTime + 10000
      burstStart = deltaTime + 20000;
    }
    setTimeout(drawBurst, 1000 / framesPerSecond);
  }
  else {
    var maxRotation = Math.random() * 6 + 2;
    setTimeout(drawShapes, 1000 / framesPerSecond, maxRotation);
  }
}

draw();
