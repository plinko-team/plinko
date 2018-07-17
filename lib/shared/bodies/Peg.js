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

var Peg = function () {
  function Peg(_ref) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Peg);

    this.x = x;
    this.y = y;
    this.type = 'peg';

    this.createPhysics();
    this.createSprite();
  }

  _createClass(Peg, [{
    key: 'createPhysics',
    value: function createPhysics() {
      var options = {
        friction: _bodies.PEG_FRICTION,
        restitution: _bodies.PEG_RESTITUTION
      };

      this.body = _matterJs.Bodies.circle(this.x, this.y, _bodies.PEG_RADIUS, options);
      this.body.isStatic = true;
      this.body.position.x = this.x;
      this.body.position.y = this.y;
      this.body.label = this.type;
      this.body.isShrinking = false;
    }
  }, {
    key: 'createSprite',
    value: function createSprite() {
      this.sprite = new PIXI.Graphics();
      this.sprite.beginFill(_colors.PEG_COLOR);
      this.sprite.drawCircle(this.x, this.y, _bodies.PEG_RADIUS);
      this.sprite.endFill();
    }
  }, {
    key: 'addToEngine',
    value: function addToEngine(world) {
      _matterJs.World.add(world, this.body);
    }
  }, {
    key: 'addToRenderer',
    value: function addToRenderer(stage) {
      stage.addChild(this.sprite);
    }
  }]);

  return Peg;
}();

exports.default = Peg;
//# sourceMappingURL=Peg.js.map