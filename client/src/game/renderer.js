import Rough from 'roughjs';

import { CANVAS } from '../shared/constants/canvas';

export default class Renderer {
  constructor(options) {
    this.canvas = document.querySelector('#canvas');
    this.canvas.width = CANVAS.WIDTH;
    this.canvas.height = CANVAS.HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    this.rough = Rough.canvas(this.canvas);
    this.generator = this.rough.generator;
    this.stage = {};
  }

  addToStage(body) {
    this.stage[body.renderId] = body;
  }

  removeFromStage(body) {
    if (this.stage[body.renderId]) {
      delete this.stage[body.renderId];
    }
  }

  render() {
    this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    Object.values(this.stage).forEach(body => {
      body.draw(this.rough);
    });
  }
}
