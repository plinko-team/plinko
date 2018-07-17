'use strict';

var _Wall = require('./bodies/Wall');

var _matterJs = require('matter-js');

stage = new PIXI.Container();
world = Matter.World;

function createWalls() {
  var leftWall = new _Wall.VerticalWall({ x: 0, y: 100 });
  var rightWall = new _Wall.VerticalWall({ x: 795, y: 100 });
  var ground = new _Wall.HorizontalWall();

  leftWall.addToRenderer(stage);
  leftWall.addToEngine(world);

  rightWall.addToRenderer(stage);
  rightWall.addToEngine(world);

  ground.addToRenderer(stage);
  ground.addToEngine(world);
}

function createBucketWalls() {
  for (var i = 100; i < 800; i += 100) {
    var bucket = new _Wall.BucketWall({ x: i });
    bucket.addToRenderer(stage);
    bucket.addToEngine(world);
  }
}

createWalls();
createBucketWalls();
renderer.render(stage);
//# sourceMappingURL=setup.js.map