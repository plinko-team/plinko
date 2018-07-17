import * as PIXI from 'pixi.js'
import { CANVAS_COLOR } from '../shared/constants/colors'

export let renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: CANVAS_COLOR })
document.querySelector('.canvas').appendChild(renderer.view);

export let stage = new PIXI.Container();

//renderer.render

//Create a Pixi Application
//let app = new PIXI.Application({width: 256, height: 256});

//Add the canvas that Pixi automatically created for you to the HTML document
//document.body.appendChild(app.view);
