import { World } from 'matter-js';

export default class GameObject {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  addToRenderer(stage) {
    stage.addChild(this.sprite);
  }

  addToEngine(world) {
    World.add(world, this.body);
  }
}
