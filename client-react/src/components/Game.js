import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import EndGameButton from './EndGameButton';
import WinnerBanner from './WinnerBanner';

export default class Game extends Component {
  static propTypes = {
    players: PropTypes.object,
    winnerId: PropTypes.string,
    handleEndGameClick: PropTypes.func,
  }

  state = {
    someoneWon: false,
    targetScore: 63,
  }

  ComponentDidMount() {
    this.setState({targetScore: 50, someoneWon: true});
  }

  winnerBanner = (winnerId) => {
    return (
      <WinnerBanner
        winnerName={this.props.players[winnerId].name}
        winnerColorId={this.props.players[winnerId].colorId}
        handleNewGameClick={this.props.handleEndGameClick}
      />
    )
  }

  render() {
    let winnerId;

    if (this.state.someoneWon) {
      const userIds = Object.keys(this.props.activePlayers);
      winnerId = userIds.find(id => this.props.activePlayers[id].score >= this.state.targetScore);
    }

    console.log("Game winnerId", winnerId)
    console.log("Game targetScore", this.state.targetScore)

    return (
      <main>
        <Header
          players={this.props.players}
          targetScore={this.state.targetScore}
          winnerId={winnerId}
        />

        {winnerId !== undefined && this.winnerBanner(winnerId)}

        <div className="canvas"></div>

        <EndGameButton handleClick={this.props.handleEndGameClick} />
      </main>
    )
  }
}
