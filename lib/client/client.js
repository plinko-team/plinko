'use strict';

var _renderer = require('./renderer.js');

var _Chip = require('../shared/bodies/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

var _engine = require('./engine.js');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chip = new _Chip2.default({ x: 100, y: 100 });

chip.addToEngine(_engine2.default.world);
chip.addToRenderer(_renderer.stage);

_renderer.renderer.render(_renderer.stage);
//# sourceMappingURL=client.js.map