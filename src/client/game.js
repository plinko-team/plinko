import { World, Engine, Render, Events } from 'matter-js';
import Chip from '../shared/bodies/Chip';
import HoverChip from '../shared/bodies/HoverChip';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game'
import createEnvironment from '../shared/setup';



export default class Game {
  constructor({ engine, renderer, stage }) {
    this.engine = engine;
    this.renderer = renderer;
    this.stage = stage;
    this.chips = [];


  }

  init() {
    createEnvironment(this.stage);
    this.registerCanvasEvents();
    this.registerPhysicsEvents();

    return this;
  }

  onClick = (e) => {
    e.preventDefault();

    // Short circuit handler if outside of drop boundary
    if (e.offsetY > DROP_BOUNDARY) { return }

    const chip = new Chip({ x: e.offsetX, y: e.offsetY });

    chip.addToEngine(this.engine.world);
    chip.addToRenderer(this.stage);
    // chip.registerUpdateListener(this.engine);
    this.chips.push(chip)
    this.renderer.render(this.stage);

  }

  onMouseEnter = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const hoverChip = new HoverChip({ x, y });
    hoverChip.addToRenderer(this.stage);

    e.target.addEventListener('mouseleave', () => {
      hoverChip.removeChip(this.stage);
    });
  }

  onCollisionStart = (event) => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];

      if (pair.bodyA.label === 'peg') {
        pair.bodyA.sprite.tint = 0xFFAAAA;
      } else if (pair.bodyB.label === 'peg') {
        pair.bodyB.sprite.tint = 0xFFAAAA;
      }

      if (pair.bodyA.label === 'chip' && pair.bodyB.label === 'ground') {
        pair.bodyA.parentObject.shrink(() => {
          World.remove(this.engine.world, pair.bodyA)
          this.stage.removeChild(pair.bodyA.sprite)
        })
      } else if (pair.bodyB.label === 'chip' && pair.bodyA.label === 'ground') {
        pair.bodyB.parentObject.shrink(() => {
          World.remove(this.engine.world, pair.bodyB)
          this.stage.removeChild(pair.bodyB.sprite)
        })

      }
    }
  }

  registerCanvasEvents() {
    // On click, add a chip at the mouse's x and y relative to canvas
    document.querySelector('canvas').addEventListener('click', this.onClick);

    // When the client moves the mouse, display a chip overlay
    document.querySelector('canvas').addEventListener('mouseenter', this.onMouseEnter)
  }

  registerPhysicsEvents() {
    // Collision Events
    Events.on(this.engine, 'collisionStart', this.onCollisionStart);
  }

  start() {
    this.timeStarted = Date.now();
    this.nextTimestep = Date.now();

    this.loop = setInterval(() => {
      while (Date.now() > this.nextTimestep) {
        Engine.update(this.engine, TIMESTEP);
        this.nextTimestep += TIMESTEP;

        this.chips.forEach(chip => {
          chip.sprite.position.x = chip.body.position.x;
          chip.sprite.position.y = chip.body.position.y;
          chip.sprite.rotation = chip.body.angle;
        })
      }

      this.renderer.render(this.stage);
    }, 0)
  }

  stop() {
    clearInterval(this.loop);
  }
}
