'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLS = exports.ROWS = exports.BOTTOM_BUFFER = exports.TOP_BUFFER = exports.SPACING = exports.CANVAS_HEIGHT = exports.CANVAS_WIDTH = undefined;

var _bodies = require('./bodies');

var CANVAS_WIDTH = exports.CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = exports.CANVAS_HEIGHT = 600;
var SPACING = exports.SPACING = _bodies.CHIP_DIAMETER * 2;

// increase top buffer to leave more open space above pegs
var TOP_BUFFER = exports.TOP_BUFFER = SPACING * 3;
// increase top buffer to leave more open space below pegs
var BOTTOM_BUFFER = exports.BOTTOM_BUFFER = SPACING * 6;

var ROWS = exports.ROWS = (CANVAS_HEIGHT - TOP_BUFFER - BOTTOM_BUFFER) / SPACING;

var COLS = exports.COLS = (CANVAS_WIDTH - SPACING * 2) / SPACING;

console.log(COLS);
//# sourceMappingURL=canvas.js.map