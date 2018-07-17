import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import { World } from 'matter-js'

let leftWall = new VerticalWall({x: 0, y: 100, width: 5, height: 500});
let rightWall = new VerticalWall({x: 795, y: 100, width: 5, height: 500});
let ground = new HorizontalWall();

stage = new PIXI.Container();
world = Matter.World;

leftWall.addToRenderer(stage);
leftWall.addToEngine(world);

rightWall.addToRenderer(stage);
rightWall.addToEngine(world);

ground.addToRenderer(stage);
ground.addToEngine(world);

function createBucketWalls() {
  for (let i = 100; i < 800; i += 100) {
    let bucket = new BucketWall({x: i, y: 600, width: 5, height: 100});
    bucket.addToRenderer(stage);
    bucket.addToEngine(world);
  }
}

createBucketWalls();
renderer.render(stage);


