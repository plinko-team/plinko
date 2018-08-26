import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class WinnerBanner extends Component {
  static propTypes = {
    winnerName: PropTypes.string,
    winningPlayerId: PropTypes.string,
  }

  state = {
    // must match serverEngine's endRound timeout
    countdown: 5,
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => {
        if (this.state.countdown > 1) {
          return {countdown: prevState.countdown - 1};
        } else {
          // never count below 1, even if server is delayed
          return prevState;
        }
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className={"banner winner-banner player-" + this.props.winningPlayerId}>
        <span className="winner-text">
          <span className="winner-name">{this.props.winnerName}</span> won!
          Next round in {this.state.countdown}...
        </span>
      </div>
    );
  }
}
