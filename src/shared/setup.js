import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import { World } from 'matter-js'

stage = new PIXI.Container();
world = Matter.World;

function createWalls() {
  const leftWall = new VerticalWall({x: 0, y: 100});
  const rightWall = new VerticalWall({x: 795, y: 100});
  const ground = new HorizontalWall();

  leftWall.addToRenderer(stage);
  leftWall.addToEngine(world);
  
  rightWall.addToRenderer(stage);
  rightWall.addToEngine(world);
  
  ground.addToRenderer(stage);
  ground.addToEngine(world);
}

function createBucketWalls() {
  for (let i = 100; i < 800; i += 100) {
    let bucket = new BucketWall({x: i});
    bucket.addToRenderer(stage);
    bucket.addToEngine(world);
  }
}

createWalls();
createBucketWalls();
renderer.render(stage);


