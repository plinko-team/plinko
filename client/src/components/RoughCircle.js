import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rough from 'roughjs';

export default class RoughCircle extends Component {
  static propTypes = {
    canvasId: PropTypes.string,
    options: PropTypes.obj,
    playerId: PropTypes.string,
  }

  static defaultProps = {
    diameter: 20,
    options: {},
    playerId: null,
  }

  defaultOptions = {
    roughness: .2,
    fillStyle: 'solid',
    fill: '#E6EBE0',
  }

  componentDidMount() {
    this.canvas = document.querySelector("#canvas-" + this.props.canvasId);
    this.canvas.width = this.props.diameter + 5;  // pad by 5 to account for Rough stroke
    this.canvas.height = this.props.diameter + 5; // pad by 5 to account for Rough stroke
    this.ctx = this.canvas.getContext('2d');
    this.rough = Rough.canvas(this.canvas);

    let fill;
    if (this.props.playerId) {
      fill = 'blue';
    } else if (this.props.isTitle) {
      fill = 'red';
    }

    // split this stuff into CitationCirle, PlayerCircle, LogoCircle, which all render a RoughCircle

    this.defaultOptions.fill = fill;

    this.options = Object.assign(this.props.options, this.defaultOptions)
    this.rough.circle(this.canvas.width / 2, this.canvas.height / 2, this.props.diameter, this.options);
  }

  // canvas must have unique id to select it for rough
  // canvas and/or span must have knowable class or id related to player to select it with css
  // non-active players do not have a playerId
  // can't use UUID because it could start with a number

  render() {
    return (
      <span className="rough-circle">
        {/* canvasId may be a UUID starting with a number, so prepend with a string */}
        {/* canvasId is intended only for selecting canvas for RoughJS in `componentDidMount` */}
        {/* To select canvas in CSS for styling, use parent element classes and `canvas` */}
        <canvas id={"canvas-" + this.props.canvasId}></canvas>
      </span>
    )
  }
}
