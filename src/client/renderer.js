import * as PIXI from 'pixi.js';
import { CANVAS_COLOR } from '../shared/constants/colors';
import { CANVAS } from '../shared/constants/canvas';

const defaultOptions = {
  width: CANVAS.WIDTH,
  height: CANVAS.HEIGHT,
  backgroundColor: CANVAS_COLOR,
  antialias: false,
  resolution: 2,
}

export default class Renderer {
  constructor(options) {
    this.renderer = new PIXI.CanvasRenderer(Object.assign(defaultOptions, options));
    this.stage = new PIXI.Container();

    document.querySelector('.canvas').appendChild(this.renderer.view)
  }

  render(stage=this.stage) {
    this.renderer.render(stage)
  }

  spriteUpdate(chips, interpolation=1) {
    for (let id of Object.keys(chips)) {
      let chip = chips[id];
      let sprite = chip.sprite;

      // body.position.x = chip.lastX + (chip.nextX - chip.lastX) * interpolation
      // body.position.y = chip.lastY + (chip.nextY - chip.lastY) * interpolation
      // body.angle = chip.lastAngle + (chip.nextAngle - chip.lastAngle) * interpolation
    }
  }
}
