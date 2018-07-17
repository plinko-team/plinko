import { Bodies, World } from 'matter-js';
import { CHIP_FRICTION, CHIP_RESTITUTION, CHIP_RADIUS } from '../constants/bodies';
import { CHIP_COLOR } from '../constants/colors';
import { Events } from 'matter-js'
let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
}

export default class Chip {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.type = 'chip';
    this.createPhysics();
    if (typeof window === 'object') { this.createSprite() };
  }

  registerUpdateListener(engine) {
    Events.on(engine, 'afterUpdate', () => {
      this.sprite.position.x = this.body.position.x;
      this.sprite.position.y = this.body.position.y;
      this.x = this.body.position.x;
      this.y = this.body.position.y;
    })
  }

  createSprite() {
    const chip = new PIXI.Sprite.fromImage('https://i.imgur.com/Q6GxA85.png');
    chip.position.x = this.x;
    chip.position.y = this.y;
    chip.height = 20;
    chip.width = 20;
    chip.anchor.set(0.5, 0.5);

    this.sprite = chip;
  }

  createPhysics() {
    const options = {
      restitution: CHIP_RESTITUTION,
      friction: CHIP_FRICTION,
    }

    this.body = Bodies.circle(this.x, this.y, CHIP_RADIUS, options);
    this.body.position.x = this.x;
    this.body.position.y = this.y;
  }

  addToRenderer(stage) {
    stage.addChild(this.sprite);
  }

  addToEngine(world) {
    World.add(world, this.body);
  }
}
