'use strict';

var _Wall = require('./bodies/Wall');

var _matterJs = require('matter-js');

var leftWall = new _Wall.VerticalWall({ x: 0, y: 100, width: 5, height: 500 });
var rightWall = new _Wall.VerticalWall({ x: 795, y: 100, width: 5, height: 500 });
var ground = new _Wall.HorizontalWall();

stage = new PIXI.Container();
world = Matter.World;

leftWall.addToRenderer(stage);
leftWall.addToEngine(world);

rightWall.addToRenderer(stage);
rightWall.addToEngine(world);

ground.addToRenderer(stage);
ground.addToEngine(world);

function createBucketWalls() {
  for (var i = 100; i < 800; i += 100) {
    var bucket = new _Wall.BucketWall({ x: i, y: 600, width: 5, height: 100 });
    bucket.addToRenderer(stage);
    bucket.addToEngine(world);
  }
}

createBucketWalls();
renderer.render(stage);
//# sourceMappingURL=setup.js.map