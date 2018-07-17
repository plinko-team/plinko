'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matterJs = require('matter-js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameObject = function () {
  function GameObject(_ref) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, GameObject);

    this.x = x;
    this.y = y;
  }

  _createClass(GameObject, [{
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

  return GameObject;
}();

exports.default = GameObject;
//# sourceMappingURL=GameObject.js.map