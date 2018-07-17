import * as PIXI from 'pixi.js'
import { CANVAS_COLOR } from '../shared/constants/colors'

// Default width and height are 800, 600; add to constants if you want to change
export const renderer = new PIXI.autoDetectRenderer({ backgroundColor: CANVAS_COLOR })
document.querySelector('.canvas').appendChild(renderer.view);

export const stage = new PIXI.Container();

//renderer.render

//Create a Pixi Application
//let app = new PIXI.Application({width: 256, height: 256});

//Add the canvas that Pixi automatically created for you to the HTML document
//document.body.appendChild(app.view);
