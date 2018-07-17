import Peg from './bodies/Peg';
import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import engine from '../client/engine';
import { ROWS, COLS, SPACING, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/canvas';

function createWalls(stage) {
  const leftWall = new VerticalWall({x: 0, y: 400});
  const rightWall = new VerticalWall({x: CANVAS_WIDTH, y: 400});
  const ground = new HorizontalWall();
  if (typeof window === 'object') { createWallSprites(stage, leftWall, rightWall, ground) }
  createWallBodies(leftWall, rightWall, ground);
}

function createWallSprites(stage, ...walls) {
  walls.forEach(wall => wall.addToRenderer(stage));
}

function createWallBodies(...walls) {
  walls.forEach(wall => wall.addToEngine(engine.world));
}

function createBucketWalls(stage) {
  for (let i = 1; i < COLS; i++) {
    let bucket = new BucketWall({ x: i * SPACING });

    if (typeof window === 'object') { bucket.addToRenderer(stage) }
    bucket.addToEngine(engine.world);
  }
}

function createPegs(stage) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS + 1; col++) {
      let rowPlacement = col * SPACING;
      let colPlacement = SPACING + (row * SPACING);
      if (row % 2 === 0) {
        rowPlacement += SPACING / 2;
      }

      let peg = new Peg({ x: rowPlacement, y: colPlacement });
      peg.addToEngine(engine.world);
      if (peg.sprite) { peg.addToRenderer(stage) };
    }
  }
}

export default function createEnvironment(stage) {
  createWalls(stage);
  createBucketWalls(stage);
  createPegs(stage);
}
