'use strict';

var _renderer = require('./renderer.js');

var _Chip = require('../shared/bodies/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

var _engine = require('./engine.js');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.querySelector('canvas').addEventListener('click', function (e) {
  e.preventDefault();

  var chip = new _Chip2.default({ x: e.offsetX, y: e.offsetY });

  chip.addToEngine(_engine2.default.world);
  chip.addToRenderer(_renderer.stage);

  _renderer.renderer.render(_renderer.stage);
});

document.querySelector('canvas').addEventListener('mousemove', function (e) {
  var x = e.offsetX;
  var y = e.offsetY;

  var chip = new _Chip2.default({ x: x, y: y });
  chip.addToRenderer(_renderer.stage);
  _renderer.renderer.render(_renderer.stage);
});

_renderer.renderer.render(_renderer.stage);
//# sourceMappingURL=client.js.map