import Peg from './bodies/Peg';
import Triangle from './bodies/Triangle';
import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import { ROWS, COLS, ROW_SPACING, COL_SPACING, VERTICAL_MARGIN, HORIZONTAL_OFFSET, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/canvas';

function createWalls(stage, engine) {
  const leftWall = new VerticalWall({x: 0, y: CANVAS_HEIGHT / 2});
  const rightWall = new VerticalWall({x: CANVAS_WIDTH, y: CANVAS_HEIGHT / 2});
  const ground = new HorizontalWall();
  if (typeof window === 'object') { createWallSprites(stage, leftWall, rightWall, ground) }
  createWallBodies(engine, leftWall, rightWall, ground);
}

function createWallSprites(stage, ...walls) {
  walls.forEach(wall => wall.addToRenderer(stage));
}

function createWallBodies(engine, ...walls) {
  walls.forEach(wall => wall.addToEngine(engine.world));
}

function createBucketWalls(stage, engine) {
  for (let i = 1; i < COLS; i++) {
    let bucket = new BucketWall({ x: i * COL_SPACING });

    if (typeof window === 'object') { bucket.addToRenderer(stage) }
    bucket.addToEngine(engine.world);
  }
}

function createTriangles(stage, engine) {

  // Positional calculations and vertices for the wall triangles.
  let triangles = [{x: 772, y: 290, vertices: '50 150 15 75 50 0', side: 'right'}, {x: 772, y: 158, vertices: '50 150 15 75 50 0', side: 'right'},
                   {x: 772, y: 422, vertices: '50 150 15 75 50 0', side: 'right'}, {x: 28, y: 305, vertices: '50 150 85 75 50 0', side: 'left'},
                   {x: 28, y: 173, vertices: '50 150 85 75 50 0', side: 'left'}, {x: 28, y: 437, vertices: '50 150 85 75 50 0', side: 'left'}];


  triangles.forEach(triangle => {
    let t = new Triangle(triangle);
    t.addToEngine(engine.world);
    if (typeof window === 'object') { t.addToRenderer(stage) }
  });
}

function createPegs(stage, engine, pegs) {
  const verticalOffset = ROW_SPACING / 2;
  const horizontalOffset = COL_SPACING / 2;

  let id = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 1; col < COLS; col++) {
      let x = col * COL_SPACING;
      // leave extra space at top of frame to drop chips
      let y = VERTICAL_MARGIN + (row * ROW_SPACING);

      if (row % 2 === 1 && col === COLS - 1) {
        // skip last peg on odd rows
        break;
      } else if (row % 2 === 1) {
        // offset columns in odd rows by half
        x += HORIZONTAL_OFFSET;
      }

      let peg = new Peg({ id, x, y });
      pegs[id] = peg;
      peg.addToEngine(engine.world);
      if (peg.sprite) { peg.addToRenderer(stage) };

      id++;
    }
  }
}

export default function createEnvironment(stage, engine, pegs) {
  createWalls(stage, engine);
  createBucketWalls(stage, engine);
  createPegs(stage, engine, pegs);
  createTriangles(stage, engine);
}
