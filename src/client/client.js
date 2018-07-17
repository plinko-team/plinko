import { renderer, stage } from './renderer.js';
import Chip from '../shared/bodies/Chip';
import engine from './engine.js';

document.querySelector('canvas').addEventListener('click', (e) => {
  e.preventDefault()

  const chip = new Chip({ x: e.offsetX, y: e.offsetY });

  chip.addToEngine(engine.world);
  chip.addToRenderer(stage);

  renderer.render(stage);
})

renderer.render(stage);
