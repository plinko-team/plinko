import { CHIP } from '../../shared/constants/bodies';
import { PLAYER_COLORS } from '../../shared/constants/colors';
import { CHIP_SPRITE } from '../../shared/constants/sprites';
import GameObject from './GameObject';

let PIXI = require('pixi.js');

export default class Chip extends GameObject {
  static count = 0;

  constructor({ id, x, y, ownerId }) {
    super({ id, x, y, ownerId });
    this.type = 'chip';
    this.createSprite()
    this.sprite.parentObject = this;

    Chip.count++;
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
    if (this.shrinking) { return }
    this.shrinking = true;

    setTimeout(() => {
      // 1 + Math.log(0.95) / N
      // where N is number of chips before max shrinking
      // Here, it is 0.995 for N = 10
      // 0.95 is max shrinking factor

      const SHRINK_FACTOR = Math.max(0.95, Math.min(0.995, 0.995 ** Chip.count));

      const interval = setInterval(() => {
        this.sprite.width *= SHRINK_FACTOR ** 2;
        this.sprite.height *= SHRINK_FACTOR ** 2;

        if (this.sprite.width < 0.1) {
          Chip.count--;
          clearInterval(interval);
          if (callback) callback();
        }
      }, 10)
    }, 50)
  }
}
