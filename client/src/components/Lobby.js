import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import PlayerJoinForm from './PlayerJoinForm';
import StartGameButton from './StartGameButton';

export default class Lobby extends Component {
  static propTypes = {
    userId: PropTypes.string,
    activePlayers: PropTypes.object,
    waitingPlayers: PropTypes.object,
    gameInProgress: PropTypes.bool,
    handleStartGameClick: PropTypes.func,
    handlePlayerJoin: PropTypes.func,
    isNameFormOpen: PropTypes.bool,
  }

  state = {
    userName: '',
  }

  // lobby should maintain state for isNameFormOpen, which starts as false
  // updated based on isActivePlayer() || isWaitingPlayer()

  activePlayerList = () => {
    return (
      <div className="active-players row">
        <div className="players-container four columns">
          <h2>{"You've got next"}</h2>
          <ul>
            {this.playerItems(this.props.activePlayers, true)}
          </ul>
        </div>

        {this.isActivePlayer() && this.gameStartElement()}

      </div>
    )
  }

  waitingPlayerList = () => {
    return (
      <div className="waiting-players">
        <div className="players-container">
          <h2>Your turn is coming up</h2>
          {this.isWaitingPlayer() && <p className="alert">Plinko supports four players at a time. When an active players leaves, the first waiting player will move up to join the next game.</p>}
          <ul>
            {this.playerItems(this.props.waitingPlayers)}
          </ul>
      </div>
      </div>
    )
  }

  playerItems = (playersObj, active=false) => {
    return Object.keys(playersObj).map(id => {
      let player = playersObj[id];
      return (
        <li key={"player-" + id} className={active ? "player-color-" + player.colorId : ""}>
          <span className="dot"></span>
          {player.name}
        </li>
      )
    })
  }

  gameStartElement = () => {
    if (this.isActivePlayer() && this.props.gameInProgress) {
      return (
        <p class="alert five columns offset-by-two">
          A game is currently in progress. When it's over, you and the other active players can start a new game.
        </p>
      )
    } else if (this.isActivePlayer()) {
      return (
        <StartGameButton
          handleClick={this.props.handleStartGameClick}
          columnCount="three"
        />
      )
    }
  }

  isActivePlayer = () => {
    return Object.keys(this.props.activePlayers).includes(this.props.userId);
  }

  isWaitingPlayer = () => {
    return Object.keys(this.props.waitingPlayers).includes(this.props.userId);
  }

  isNameFormOpen = () => {
    return !this.isActivePlayer() && !this.isWaitingPlayer()
  }

  handleNameChange = (input) => {
    this.setState({userName: input}, () => {
      console.log("This sets Lobby's state.userName to " + this.state.userName);
    });
  }

  handlePlayerJoin = () => {
    // validation logic and error notice here
    this.props.handlePlayerJoin(this.state.userName.trim());
  }

  render() {
    return (
      <main>
        <Header />
        <div className="main-content lobby">
          {this.isNameFormOpen() && <PlayerNameForm userName={this.state.userName} handleSubmit={this.handlePlayerJoin} handleChange={this.handleNameChange} />}

          {Object.keys(this.props.activePlayers).length && this.activePlayerList()}
          {Object.keys(this.props.waitingPlayers).length && this.waitingPlayerList()}
        </div>
      </main>
    )
  }
}
