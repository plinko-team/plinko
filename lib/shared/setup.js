'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createEnvironment;

var _Peg = require('./bodies/Peg');

var _Peg2 = _interopRequireDefault(_Peg);

var _Wall = require('./bodies/Wall');

var _engine = require('../client/engine');

var _engine2 = _interopRequireDefault(_engine);

var _canvas = require('./constants/canvas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createWalls(stage) {
  var leftWall = new _Wall.VerticalWall({ x: 0, y: 400 });
  var rightWall = new _Wall.VerticalWall({ x: _canvas.CANVAS_WIDTH, y: 400 });
  var ground = new _Wall.HorizontalWall();
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    createWallSprites(stage, leftWall, rightWall, ground);
  }
  createWallBodies(leftWall, rightWall, ground);
}

function createWallSprites(stage) {
  for (var _len = arguments.length, walls = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    walls[_key - 1] = arguments[_key];
  }

  walls.forEach(function (wall) {
    return wall.addToRenderer(stage);
  });
}

function createWallBodies() {
  for (var _len2 = arguments.length, walls = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    walls[_key2] = arguments[_key2];
  }

  walls.forEach(function (wall) {
    return wall.addToEngine(_engine2.default.world);
  });
}

function createBucketWalls(stage) {
  for (var i = 1; i < _canvas.COLS; i++) {
    var bucket = new _Wall.BucketWall({ x: i * _canvas.SPACING });

    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      bucket.addToRenderer(stage);
    }
    bucket.addToEngine(_engine2.default.world);
  }
}

function createPegs(stage) {
  for (var row = 0; row < _canvas.ROWS; row++) {
    for (var col = 0; col < _canvas.COLS + 1; col++) {
      var rowPlacement = col * _canvas.SPACING;
      var colPlacement = _canvas.SPACING + row * _canvas.SPACING;
      if (row % 2 === 0) {
        rowPlacement += _canvas.SPACING / 2;
      }

      var peg = new _Peg2.default({ x: rowPlacement, y: colPlacement });
      peg.addToEngine(_engine2.default.world);
      if (peg.sprite) {
        peg.addToRenderer(stage);
      };
    }
  }
}

function createEnvironment(stage) {
  createWalls(stage);
  createBucketWalls(stage);
  createPegs(stage);
}
//# sourceMappingURL=setup.js.map