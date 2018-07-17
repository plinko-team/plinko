'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stage = exports.renderer = undefined;

var _pixi = require('pixi.js');

var PIXI = _interopRequireWildcard(_pixi);

var _colors = require('../shared/constants/colors');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Default width and height are 800, 600,
// add to constants if you want to change them
var options = {
  backgroundColor: _colors.CANVAS_COLOR,
  antialias: false,
  resolution: 2
};
var renderer = exports.renderer = new PIXI.CanvasRenderer(options);
document.querySelector('.canvas').appendChild(renderer.view);

var stage = exports.stage = new PIXI.Container();
//# sourceMappingURL=renderer.js.map