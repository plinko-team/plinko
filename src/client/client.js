import { renderer, stage } from './renderer.js';
import Chip from '../shared/bodies/Chip';
import engine from './engine.js';
import createEnvironment from '../shared/setup.js'

// On click, add a chip at the mouse's x and y relative to canvas
document.querySelector('canvas').addEventListener('click', (e) => {
  e.preventDefault()

  const chip = new Chip({ x: e.offsetX, y: e.offsetY });

  chip.addToEngine(engine.world);
  chip.addToRenderer(stage);

  renderer.render(stage);
});


createEnvironment();

// // When the client moves the mouse, display a chip overlay
// document.querySelector('canvas').addEventListener('mousemove', (e) => {
//   const x = e.offsetX;
//   const y = e.offsetY;
//
//   const chip = new Chip({ x, y });
//   chip.addToRenderer(stage);
//   renderer.render(stage)
// })


renderer.render(stage);
