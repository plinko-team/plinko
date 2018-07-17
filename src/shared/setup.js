import Peg from './bodies/Peg';
import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import engine from '../client/engine';
import { ROWS, COLS, ROW_SPACING, COL_SPACING, VERTICAL_OFFSET, HORIZONTAL_OFFSET, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/canvas';

function createWalls(stage) {
  const leftWall = new VerticalWall({x: 0, y: CANVAS_HEIGHT / 2});
  const rightWall = new VerticalWall({x: CANVAS_WIDTH, y: CANVAS_HEIGHT / 2});
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
    let bucket = new BucketWall({ x: i * COL_SPACING });

    if (typeof window === 'object') { bucket.addToRenderer(stage) }
    bucket.addToEngine(engine.world);
  }
}

function createPegs(stage) {
  const verticalOffset = ROW_SPACING / 2;
  const horizontalOffset = COL_SPACING / 2;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 1; col < COLS; col++) {
      let xPlacement = col * COL_SPACING;
      // gives vertical offset to all rows to leave space to drop chips
      let yPlacement = VERTICAL_OFFSET + ROW_SPACING + (row * ROW_SPACING);
      if (row % 2 === 1 && col === COLS - 1) {
        // skip last peg on odd rows
        break;
      } else if (row % 2 === 1) {
        // gives horizontal offset to columns in odd rows
        xPlacement += HORIZONTAL_OFFSET;
      }

      let peg = new Peg({ x: xPlacement, y: yPlacement });
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
