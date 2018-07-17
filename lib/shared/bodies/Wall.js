'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BucketWall = exports.HorizontalWall = exports.VerticalWall = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _matterJs = require('matter-js');

var _bodies = require('../constants/bodies');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PIXI = void 0;

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
  PIXI = require('pixi.js');
}

var Wall = function () {
  function Wall(_ref) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height;

    _classCallCheck(this, Wall);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.createPhysics({ width: width, height: height });
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      this.createSprite();
    };
  }

  _createClass(Wall, [{
    key: 'createPhysics',
    value: function createPhysics(_ref2) {
      var width = _ref2.width,
          height = _ref2.height;

      var options = {
        restitution: _bodies.PEG_RESTITUTION,
        friction: _bodies.PEG_FRICTION
      };

      this.body = _matterJs.Bodies.rectangle(this.x, this.y, this.width, this.height, options);
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
      this.sprite.beginFill(0xff22aa);
      this.sprite.drawRect(this.x, this.y, this.width, this.height);
      this.sprite.endFill();
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

  return Wall;
}();

var VerticalWall = exports.VerticalWall = function (_Wall) {
  _inherits(VerticalWall, _Wall);

  function VerticalWall(_ref3) {
    var x = _ref3.x,
        y = _ref3.y,
        width = _ref3.width,
        height = _ref3.height;

    _classCallCheck(this, VerticalWall);

    return _possibleConstructorReturn(this, (VerticalWall.__proto__ || Object.getPrototypeOf(VerticalWall)).call(this, { x: x, y: y, width: width, height: height }));
  }

  return VerticalWall;
}(Wall);

var HorizontalWall = exports.HorizontalWall = function (_Wall2) {
  _inherits(HorizontalWall, _Wall2);

  function HorizontalWall() {
    _classCallCheck(this, HorizontalWall);

    return _possibleConstructorReturn(this, (HorizontalWall.__proto__ || Object.getPrototypeOf(HorizontalWall)).call(this, { x: 0,
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
    var x = _ref4.x,
        y = _ref4.y,
        width = _ref4.width,
        height = _ref4.height;

    _classCallCheck(this, BucketWall);

    return _possibleConstructorReturn(this, (BucketWall.__proto__ || Object.getPrototypeOf(BucketWall)).call(this, { x: x, y: y, width: width, height: height }));
  }

  return BucketWall;
}(Wall);
//# sourceMappingURL=Wall.js.map