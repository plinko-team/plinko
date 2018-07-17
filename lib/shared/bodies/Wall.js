'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BucketWall = exports.HorizontalWall = exports.VerticalWall = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _matterJs = require('matter-js');

var _bodies = require('../constants/bodies');

var _colors = require('../constants/colors');

var _canvas = require('../constants/canvas');

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

var Wall = function (_GameObject) {
  _inherits(Wall, _GameObject);

  function Wall(_ref) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height;

    _classCallCheck(this, Wall);

    var _this = _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, { x: x, y: y }));

    _this.width = width;
    _this.height = height;
    _this.createPhysics({ width: width, height: height });
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      _this.createSprite();
    };
    return _this;
  }

  _createClass(Wall, [{
    key: 'createPhysics',
    value: function createPhysics(_ref2) {
      var width = _ref2.width,
          height = _ref2.height;

      var options = {
        restitution: _bodies.WALL_RESTITUTION,
        friction: _bodies.WALL_FRICTION
      };

      this.body = _matterJs.Bodies.rectangle(this.x, this.y, this.width, this.height, options);
      this.body.isStatic = true;
      this.body.position.x = this.x;
      this.body.position.y = this.y;
      this.body.label = this.type;
    }
  }, {
    key: 'createSprite',
    value: function createSprite() {
      this.sprite = new PIXI.Graphics();
      this.sprite.beginFill(_colors.WALL_COLOR);
      this.sprite.drawRect(this.x, this.y, this.width, this.height);
      this.sprite.endFill();
    }
  }]);

  return Wall;
}(_GameObject3.default);

var VerticalWall = exports.VerticalWall = function (_Wall) {
  _inherits(VerticalWall, _Wall);

  function VerticalWall(_ref3) {
    var x = _ref3.x,
        y = _ref3.y;

    _classCallCheck(this, VerticalWall);

    return _possibleConstructorReturn(this, (VerticalWall.__proto__ || Object.getPrototypeOf(VerticalWall)).call(this, { x: x, y: y, width: 5, height: 500 }));
  }

  return VerticalWall;
}(Wall);

var HorizontalWall = exports.HorizontalWall = function (_Wall2) {
  _inherits(HorizontalWall, _Wall2);

  function HorizontalWall() {
    _classCallCheck(this, HorizontalWall);

    return _possibleConstructorReturn(this, (HorizontalWall.__proto__ || Object.getPrototypeOf(HorizontalWall)).call(this, {
      x: 0,
      y: 590,
      width: 800,
      height: 10
    }));
  }

  return HorizontalWall;
}(Wall);

var BucketWall = exports.BucketWall = function (_Wall3) {
  _inherits(BucketWall, _Wall3);

  function BucketWall(_ref4) {
    var x = _ref4.x;

    _classCallCheck(this, BucketWall);

    return _possibleConstructorReturn(this, (BucketWall.__proto__ || Object.getPrototypeOf(BucketWall)).call(this, { x: x, y: _canvas.CANVAS_HEIGHT - 100, width: 5, height: 100 }));
  }

  return BucketWall;
}(Wall);
//# sourceMappingURL=Wall.js.map