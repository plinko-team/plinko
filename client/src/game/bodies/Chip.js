import { CHIP } from '../../shared/constants/bodies';
import { PLAYER_COLORS } from '../../shared/constants/colors';
import { CHIP_SPRITE } from '../../shared/constants/sprites';
import GameObject from './GameObject';

let PIXI = require('pixi.js');

export default class Chip extends GameObject {
  static count = 0

  constructor({ id, x, y, ownerId }) {
    super({ id, x, y, ownerId });
    this.type = 'chip';
    this.createSprite()
    this.sprite.parentObject = this;
  }

  createSprite() {
    const chip = new PIXI.Sprite.fromImage(CHIP_SPRITE);
    chip.position.x = this.x;
    chip.position.y = this.y;
    chip.height = CHIP.DIAMETER;
    chip.width = CHIP.DIAMETER;
    chip.anchor.set(0.5, 0.5);
    chip.tint = PLAYER_COLORS[this.ownerId];

    this.sprite = chip;
    this.shrinking = false;
  }

  shrink(callback) {
    this.shrinking = true;

    setTimeout(() => {
      const SHRINK_FACTOR = 0.95;

      const interval = setInterval(() => {
        this.sprite.width *= SHRINK_FACTOR ** 2;
        this.sprite.height *= SHRINK_FACTOR ** 2;

        if (this.sprite.width < 0.1) {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 10)
    }, 50)
  }
}
