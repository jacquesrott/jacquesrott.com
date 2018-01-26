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
  return Math.floor(Math.random() * (array.length));
}

function getItem(radius, theta) {
  var index = getItemIndex(shapes);

  var angle = (theta * (1 / (radius  - 1)) * 90 * Math.PI) / 180;
  radius *= 2 * Math.random();
  return {
    index: index,
    angle: angle * Math.round(Math.random() * 4),
    x: scale * radius * Math.cos(angle),
    y: scale * radius * Math.sin(angle),
  };
}

function drawItem(item, rotation, context, maxRotation) {
  for (var a = 1; a <= maxRotation; a++) {
    context.save();
    context.strokeStyle = '#efefef';
    context.lineWidth = 1.5;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(a * Math.PI / (maxRotation / 2) );
    context.rotate(globalRotation * Math.PI / 180);
    context.translate(item.x, item.y);
    context.rotate(item.angle);
    context.scale(Math.random(), Math.random());
    context.stroke(shapes[item.index]);
    context.restore()
  }
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

var framesPerSecond = 20;
var globalRotation = 0;
var canvas = document.getElementById('grid');

function draw() {
  setTimeout(function drawShapes() {
    if (!canvas.getContext) {
      return;
    }
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(16, 16, 16, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var border = Math.round(
      Math.random() * 50 + 10
    );

    var maxRotation = Math.random() * 6 + 2;

    for (var i = 0 ; i < border; i++) {
      var item = null;
      if (i == 0) {
        item = getItem(i, 0);
        drawItem(item, globalRotation, ctx, maxRotation);
      }
      var maxRadius = i * Math.random() * 3;
      for (var j = 0 ; j < maxRadius; j++) {
        item = getItem(maxRadius * Math.random() * j, j);
        drawItem(item, globalRotation, ctx, maxRotation);
      }
      globalRotation += Math.random() * 40 + 1
    }

    window.requestAnimationFrame(draw);
  }, 1000 / framesPerSecond);
}

draw();
