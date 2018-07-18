'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bodies = require('../constants/bodies');

var _colors = require('../constants/colors');

var _matterJs = require('matter-js');

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

var HoverChip = function (_GameObject) {
  _inherits(HoverChip, _GameObject);

  function HoverChip(_ref) {
    var x = _ref.x,
        y = _ref.y,
        stage = _ref.stage;

    _classCallCheck(this, HoverChip);

    var _this = _possibleConstructorReturn(this, (HoverChip.__proto__ || Object.getPrototypeOf(HoverChip)).call(this, { x: x, y: y }));

    _this.type = 'hover_chip';
    _this.stage = stage;
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      _this.createSprite();
    };
    _this.addToRenderer(stage);
    _this.registerListener();
    return _this;
  }

  _createClass(HoverChip, [{
    key: 'registerListener',
    value: function registerListener() {
      var _this2 = this;

      document.querySelector('canvas').addEventListener('mouseleave', function (e) {
        _this2.removeChip();
      });

      document.querySelector('canvas').addEventListener('mousemove', function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        _this2.sprite.position.x = x;
        _this2.sprite.position.y = y;
      });
    }
  }, {
    key: 'removeChip',
    value: function removeChip() {
      this.stage.removeChild(this.sprite);
    }
  }, {
    key: 'createSprite',
    value: function createSprite() {
      var chip = new PIXI.Sprite.fromImage('https://i.imgur.com/Q6GxA85.png');
      chip.position.x = this.x;
      chip.position.y = this.y;
      chip.alpha = .2;
      chip.height = _bodies.CHIP_DIAMETER;
      chip.width = _bodies.CHIP_DIAMETER;
      chip.anchor.set(0.5, 0.5);

      this.sprite = chip;
    }
  }]);

  return HoverChip;
}(_GameObject3.default);

exports.default = HoverChip;
//# sourceMappingURL=HoverChip.js.map