import { renderer, stage } from './renderer';
import Chip from '../shared/bodies/Chip';
import engine from './engine';
import GameLoop from './gameLoop';
import createEnvironment from '../shared/setup';
import { Render, Events } from 'matter-js';
import HoverChip from '../shared/bodies/HoverChip';
import { DROP_BOUNDARY } from '../shared/constants/game'

// On click, add a chip at the mouse's x and y relative to canvas
document.querySelector('canvas').addEventListener('click', (e) => {
  e.preventDefault();

  // Short circuit handler if outside of drop boundary
  if (e.offsetY > DROP_BOUNDARY) { return }

  const chip = new Chip({ x: e.offsetX, y: e.offsetY });

  chip.addToEngine(engine.world);
  chip.addToRenderer(stage);
  chip.registerUpdateListener(engine);
  renderer.render(stage);
});

// Collision Events
Events.on(engine, 'collisionStart', function(event) {
  const pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i];

    if (pair.bodyA.label === 'peg') {
      pair.bodyA.sprite.tint = 0xFFAAAA;
    } else if (pair.bodyB.label === 'peg') {
      pair.bodyB.sprite.tint = 0xFFAAAA;
    }
  }
});

createEnvironment(stage);

renderer.render(stage);

let r = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 600,
    height: 800
  }
})

Render.run(r)

const gameLoop = new GameLoop({ engine, stage, renderer });
gameLoop.start();

// // When the client moves the mouse, display a chip overlay
document.querySelector('canvas').addEventListener('mouseenter', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  const hoverChip = new HoverChip({ x, y });
  hoverChip.addToRenderer(stage);

  e.target.addEventListener('mouseleave', () => {
    hoverChip.removeChip(stage);
  });
})
