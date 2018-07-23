import * as PIXI from 'pixi.js'
import { CANVAS_COLOR } from '../shared/constants/colors'

const defaultOptions = {
  width: 800,
  height: 600,
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
}
