import * as PIXI from 'pixi.js'
import { CANVAS_COLOR } from '../shared/constants/colors'

// Default width and height are 800, 600,
// add to constants if you want to change them
const options = {
  backgroundColor: CANVAS_COLOR,
  antialias: false,
  resolution: 2,
}
export const renderer = new PIXI.CanvasRenderer(options)
document.querySelector('.canvas').appendChild(renderer.view);

export const stage = new PIXI.Container();
