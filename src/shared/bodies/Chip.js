import { Bodies } from 'matter-js';
import { CHIP_DENSITY, CHIP_FRICTION, CHIP_RESTITUTION, CHIP_RADIUS, CHIP_DIAMETER } from '../constants/bodies';
import { CHIP_COLOR } from '../constants/colors';
import { Events, Body } from 'matter-js'
import GameObject from './GameObject';

let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
}

export default class Chip extends GameObject {
  constructor({ x, y }) {
    super({ x, y });
    this.type = 'chip';
    this.createPhysics();
    if (typeof window === 'object') { this.createSprite() };

    // Sprite and Body have references to each other so that we can
    // change renderer properties based on physics collisions
    this.body.sprite = this.sprite;
    this.sprite.body = this.body;
  }

  registerUpdateListener(engine) {
    Events.on(engine, 'afterUpdate', () => {
      this.sprite.position.x = this.body.position.x;
      this.sprite.position.y = this.body.position.y;
      this.sprite.rotation = this.body.angle;
      this.x = this.body.position.x;
      this.y = this.body.position.y;
    })
  }

  createSprite() {
    const chip = new PIXI.Sprite.fromImage('https://i.imgur.com/OV7kVtt.png');
    chip.position.x = this.x;
    chip.position.y = this.y;
    chip.height = CHIP_DIAMETER;
    chip.width = CHIP_DIAMETER;
    chip.anchor.set(0.5, 0.5);

    this.sprite = chip;
  }

  createPhysics() {
    const options = {
      restitution: CHIP_RESTITUTION,
      friction: CHIP_FRICTION,
    }

    this.body = Bodies.circle(this.x, this.y, CHIP_RADIUS, options);

    // this.body.mass = 0.01
    // this.body.inverseMass = 1 / this.body.mass

    Body.setDensity(this.body, CHIP_DENSITY)
    this.body.label = this.type;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
  }
}
