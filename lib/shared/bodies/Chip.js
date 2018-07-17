'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _matterJs = require('matter-js');

var _bodies = require('../constants/bodies');

var _colors = require('../constants/colors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PIXI = void 0;

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
  PIXI = require('pixi.js');
}

var Chip = function () {
  function Chip(_ref) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Chip);

    this.x = x;
    this.y = y;
    this.type = 'chip';
    this.createPhysics();
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      this.createSprite();
    };
  }

  _createClass(Chip, [{
    key: 'createSprite',
    value: function createSprite() {
      var chip = new PIXI.Sprite.fromImage('https://i.imgur.com/Q6GxA85.png');
      chip.position.x = this.x;
      chip.position.y = this.y;
      chip.height = 20;
      chip.width = 20;
      chip.anchor.set(0.5, 0.5);

      this.sprite = chip;
    }
  }, {
    key: 'createPhysics',
    value: function createPhysics() {
      var options = {
        restitution: _bodies.CHIP_RESTITUTION,
        friction: _bodies.CHIP_FRICTION
      };

      this.body = _matterJs.Bodies.circle(this.x, this.y, _bodies.CHIP_RADIUS, options);
      this.body.position.x = this.x;
      this.body.position.y = this.y;
    }
  }, {
    key: 'addToRenderer',
    value: function addToRenderer(stage) {
      stage.addChild(this.sprite);
    }
  }, {
    key: 'addToEngine',
    value: function addToEngine(world) {
      _matterJs.World.add(world, this.body);
    }
  }]);

  return Chip;
}();

exports.default = Chip;
//# sourceMappingURL=Chip.js.map