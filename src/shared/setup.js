import Peg from './bodies/Peg';
import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import { stage } from '../client/renderer';
import { engine } from '../client/engine'
import { ROWS, COLS, SPACING, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/canvas';

function createWalls() {
  const leftWall = new VerticalWall({x: 0, y: 100});
  const rightWall = new VerticalWall({x: 795, y: 100});
  const ground = new HorizontalWall();

  if (window === 'object') { createWallSprites(leftWall, rightWall, ground) }
  createWallBodies(leftWall, rightWall, ground);
}

function createWallSprites(...walls) {
  walls.forEach(wall => wall.addToRenderer(stage));
}

function createWallBodies(...walls) {
  walls.forEach(wall => wall.addToEngine(engine.world));
}

function createBucketWalls() {
  for (let i = 1; i < COLS; i++) {
    let bucket = new BucketWall({x: i * SPACING});
    if (window === 'object') { bucket.addToRenderer(stage) }
    bucket.addToEngine(engine.world);
  }
}

function createPegs() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS + 1; col++) {
      let rowPlacement = col * SPACING;
      let colPlacement = SPACING + (row * SPACING);
      if (row % 2 === 0) {
        rowPlacement += SPACING / 2;
      }

      let peg = new Peg({x: rowPlacement, y: colPlacement});
      peg.addToEngine(engine.world);
      if (peg.sprite) { peg.addToRenderer(stage) };
    }
  }
}

export default function createEnvironment() {
  createWalls();
  createBucketWalls();
  createPegs();
}
