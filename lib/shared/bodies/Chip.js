'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _matterJs = require('matter-js');

var _bodies = require('../constants/bodies');

var _colors = require('../constants/colors');

var _GameObject2 = require('./GameObject');

var _GameObject3 = _interopRequireDefault(_GameObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = void 0;

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
  PIXI = require('pixi.js');
}

var Chip = function (_GameObject) {
  _inherits(Chip, _GameObject);

  function Chip(_ref) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Chip);

    var _this = _possibleConstructorReturn(this, (Chip.__proto__ || Object.getPrototypeOf(Chip)).call(this, { x: x, y: y }));

    _this.type = 'chip';
    _this.createPhysics();
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      _this.createSprite();
    };

    // Sprite and Body have references to each other so that we can
    // change renderer properties based on physics collisions
    _this.body.sprite = _this.sprite;
    _this.sprite.body = _this.body;
    return _this;
  }

  _createClass(Chip, [{
    key: 'registerUpdateListener',
    value: function registerUpdateListener(engine) {
      var _this2 = this;

      _matterJs.Events.on(engine, 'afterUpdate', function () {
        _this2.sprite.position.x = _this2.body.position.x;
        _this2.sprite.position.y = _this2.body.position.y;
        _this2.sprite.rotation = _this2.body.angle;
        _this2.x = _this2.body.position.x;
        _this2.y = _this2.body.position.y;
      });
    }
  }, {
    key: 'createSprite',
    value: function createSprite() {
      var chip = new PIXI.Sprite.fromImage('https://i.imgur.com/OV7kVtt.png');
      chip.position.x = this.x;
      chip.position.y = this.y;
      chip.height = _bodies.CHIP_DIAMETER;
      chip.width = _bodies.CHIP_DIAMETER;
      chip.anchor.set(0.5, 0.5);

      this.sprite = chip;
    }
  }, {
    key: 'createPhysics',
    value: function createPhysics() {
      var options = {
        restitution: _bodies.CHIP_RESTITUTION,
        friction: _bodies.CHIP_FRICTION,
        slop: 0
      };

      this.body = _matterJs.Bodies.circle(this.x, this.y, _bodies.CHIP_RADIUS, options);
      this.body.label = this.type;
      this.body.position.x = this.x;
      this.body.position.y = this.y;
    }
  }]);

  return Chip;
}(_GameObject3.default);

exports.default = Chip;
//# sourceMappingURL=Chip.js.map