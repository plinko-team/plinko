import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import PlayerJoinForm from './PlayerJoinForm';
import StartGameButton from './StartGameButton';

export default class Lobby extends Component {
  static propTypes = {
    userId: PropTypes.string,
    activeUsers: PropTypes.object,
    waitingUsers: PropTypes.object,
    gameIsRunning: PropTypes.bool,
    handleStartGameClick: PropTypes.func,
    handleUserJoin: PropTypes.func,
    gameInProgress: PropTypes.bool,
  }

  state = {
    userName: '',
  }

  activeUserList = () => {
    return (
      <div className="active-players row">
        <div className="players-container four columns">
          <h2>{"You've got next"}</h2>
          <ul>
            {this.userItems(this.props.activeUsers, true)}
          </ul>
        </div>

        {this.gameStartElement()}
      </div>
    )
  }

  waitingUserList = () => {
    return (
      <div className="waiting-players">
        <div className="players-container">
          <h2>Your turn is coming up</h2>
          {this.isWaitingUser() && <p className="alert">Plinko supports four players at a time. When an active players leaves, the first waiting player will move up to join the next game.</p>}
          <ul>
            {this.userItems(this.props.waitingUsers)}
          </ul>
      </div>
      </div>
    )
  }

  userItems = (usersObj, active=false) => {
    return Object.keys(usersObj).map(id => {
      let user = usersObj[id];
      return (
        <li key={"player-" + id} className={active ? "player-" + user.playerId : ""}>
          <span className="dot"></span>
          {user.name}
        </li>
      )
    })
  }

  gameStartElement = () => {
    if (this.props.gameInProgress) {
      return (
        <p class="alert five columns offset-by-two">
          A game is currently in progress. When it's over, you and the other active players can start a new game.
        </p>
      )
    } else if (this.isActiveUser()) {
      return (
        <StartGameButton
          handleClick={this.props.handleStartGameClick}
          columnCount="three"
        />
      )
    }
  }

  isActiveUser = () => {
    return Object.keys(this.props.activeUsers).includes(this.props.userId);
  }

  isWaitingUser = () => {
    return Object.keys(this.props.waitingUsers).includes(this.props.userId);
  }

  isNameFormOpen = () => {
    // console.log('inside isNameFormOpen');
    // console.log('user is active:', this.isActiveUser());
    // console.log('user is waiting:', this.isWaitingUser());
    return !this.isActiveUser() && !this.isWaitingUser();
  }

  handleNameChange = (input) => {
    this.setState({userName: input});
  }

  handleUserJoin = () => {
    // validation logic and error notice here
    this.props.handleUserJoin(this.state.userName.trim());
  }

  render() {
    // console.log('lobby is rerendering')
    console.log("Game in progress: ", this.props.gameInProgress)
    return (
      <main>
        <Header />
        <div className="main-content lobby">
          {this.isNameFormOpen() && <PlayerJoinForm userName={this.state.userName} handleSubmit={this.handleUserJoin} handleChange={this.handleNameChange} />}

          {!!Object.keys(this.props.activeUsers).length && this.activeUserList()}
          {!!Object.keys(this.props.waitingUsers).length && this.waitingUserList()}
        </div>
      </main>
    )
  }
}
