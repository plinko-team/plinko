import { Bodies, World } from 'matter-js';
import { CHIP_RADIUS } from '../constants/game';
import { CHIP_FRICTION, CHIP_RESTITUTION } from '../constants/bodies';
import { CHIP_COLOR } from '../constants/colors';

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

  createSprite() {
    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(0x334455);
    this.sprite.drawCircle(this.x, this.y, CHIP_RADIUS);
    this.sprite.endFill();
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
