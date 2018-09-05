import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WiredCard } from 'wired-card';

export default class ScoreBar extends Component {
  static propTypes = {
    playerName: PropTypes.string,
    playerId: PropTypes.string,
    score: PropTypes.number,
    isThisPlayer: PropTypes.bool,
    isWinner: PropTypes.bool,
    targetPercentage: PropTypes.number,
  }

  state = {
    scorePercentage: '0%',
    targetBarLeftPosition: '0%',
  }

  componentDidUpdate(prevProps) {
    if (this.props.score && this.props.score !== prevProps.score) {
      this.setState({
        // 63 total pegs in game
        // percentage of all pegs player has activated
        scorePercentage: (Math.floor(this.props.score / 63 * 100)) + '%',
      });

      // wired-card will not re-draw on its own, we must ask it to whenever
      // its width must change
      document.querySelector(`.player-${this.props.playerId} wired-card`).requestRender();
    }

    if (!isNaN(this.props.targetPercentage) && this.props.targetPercentage !== prevProps.targetPercentage) {
      this.setState({
        // difference between 100% and current target percentage, as a negative
        targetBarLeftPosition: -(100 - this.props.targetPercentage) + '%',
      });
    }
  }

  render() {
    return (
      <li className={`player-${this.props.playerId}` + (this.props.isThisPlayer ? " bold" : "") + (this.props.isWinner ? " winner" : "")}>
        <span className="score-name">{this.props.playerName}</span>
        <span className="score-bar-container">
          <wired-card style={{width: this.state.scorePercentage}}></wired-card>
          <span className="target-border" style={{left: this.state.targetBarLeftPosition}}></span>
        </span>
      </li>
    )
  }

}
