import * as PIXI from 'pixi.js'
import { Bodies, World } from 'matter-js'
import { PEG_FRICTION, PEG_RESTITUTION } from '../constants/bodies'

export default class Peg {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = 'peg'

    this.createSprite()
  }

  createPhysics() {
    let options = {
      friction: PEG_FRICTION,
      restitution: PEG_RESTITUTION,
    }

    this.body = Bodies.circle(this.x, this.y, PEG_RADIUS, options)
    this.body.isStatic = true
    this.body.position.x = this.x
    this.body.position.y = this.y
    this.body.label = this.type
    this.body.isShrinking = false
  }

  createSprite() {
    this.sprite = PIXI.Graphics();
    this.sprite.beginFill(0xa0d1d3);
    this.sprite.drawCircle(this.x, this.y, PEG_RADIUS);
    this.sprite.endFill();
  }

  addToEngine(world) {
    World.add(world, this.body)
  }

  addToRenderer(stage) {
    stage.addChild(this.sprite)
  }
}
