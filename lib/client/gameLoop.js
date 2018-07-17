'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require('../shared/constants/game');

var _matterJs = require('matter-js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameLoop = function () {
  function GameLoop(_ref) {
    var engine = _ref.engine,
        renderer = _ref.renderer,
        stage = _ref.stage;

    _classCallCheck(this, GameLoop);

    this.engine = engine;
    this.renderer = renderer;
    this.stage = stage;
  }

  _createClass(GameLoop, [{
    key: 'start',
    value: function start() {
      var _this = this;

      this.timeStarted = Date.now();
      this.nextTimestep = Date.now();

      this.loop = setInterval(function () {
        while (Date.now() > _this.nextTimestep) {
          _matterJs.Engine.update(_this.engine, _game.TIMESTEP);
          _this.nextTimestep += _game.TIMESTEP;
        }

        _this.renderer.render(_this.stage);
      }, 0);
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this.loop);
    }
  }]);

  return GameLoop;
}();

exports.default = GameLoop;
//# sourceMappingURL=gameLoop.js.map