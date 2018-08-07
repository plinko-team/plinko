import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import PlayerJoinForm from './PlayerJoinForm';
import StartGameButton from './StartGameButton';
import StartBanner from './StartBanner';

export default class Lobby extends Component {
  static propTypes = {
    userId: PropTypes.string,
    activeUsers: PropTypes.object,
    waitingUsers: PropTypes.object,
    gameIsRunning: PropTypes.bool,
    handleStartGameClick: PropTypes.func,
    handleUserJoin: PropTypes.func,
    gameInProgress: PropTypes.bool,
    startBannerVisible: PropTypes.bool,
    startCount: PropTypes.number,
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

        {!this.props.startBannerVisible && this.gameStartElement()}
      </div>
    )
  }

  waitingUserList = () => {
    return (
      <div className="waiting-players">
        <div className="players-container">
          <h2>Your turn is coming up</h2>
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
          {this.props.startBannerVisible && <StartBanner count={this.props.startCount} />}

          <div className="player-lists">
            {this.isNameFormOpen() && <PlayerJoinForm userName={this.state.userName} handleSubmit={this.handleUserJoin} handleChange={this.handleNameChange} />}

            {!!Object.keys(this.props.activeUsers).length && this.activeUserList()}
            {!!Object.keys(this.props.waitingUsers).length && this.waitingUserList()}
          </div>
        </div>
      </main>
    )
  }
}
