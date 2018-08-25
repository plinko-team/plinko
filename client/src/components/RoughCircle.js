import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rough from 'roughjs';
import shortid from 'shortid';

export default class RoughCircle extends Component {
  static propTypes = {
    diameter: PropTypes.number,
    options: PropTypes.object,
    animate: PropTypes.bool,
  }

  // UUID may start with a number, so we prepend with letters to make it a valid id
  // canvasId is only for selecting canvas for RoughJS in `componentDidMount` below
  // To select canvas element in CSS for styling, use appropriate parent element classes and `canvas`
  canvasId = 'canvas-' + shortid.generate();

  componentDidMount() {
    const width = this.props.diameter + 5; // pad by 5 to account for Rough stroke
    const height = this.props.diameter + 5; // pad by 5 to account for Rough stroke
    const x = width / 2;
    const y = height / 2;

    this.canvas = document.querySelector('#' + this.canvasId);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.rough = Rough.canvas(this.canvas);
    this.rough.circle(x, y, this.props.diameter, this.props.options);

    if (this.props.animate) {
      this.interval = setInterval(() => {
        this.ctx.clearRect(0, 0, width, height);
        this.rough.circle(x, y, this.props.diameter, this.props.options);
      }, 100);
    }
  }

  componentWillUnMount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <span className="rough-circle">
        <canvas id={this.canvasId}></canvas>
      </span>
    )
  }
}
