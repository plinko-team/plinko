import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import GameContainer from './GameContainer';
import TopNav from './TopNav';
import Welcome from './pages/Welcome';
import About from './pages/About';
import Help from './pages/Help';
import Team from './pages/Team';

import openSocketConnection from '../game/socket';

class App extends Component {
  state = {
    uuid: undefined,
    socket: {},
  }

  componentDidMount() {
    // Wired elements do not automatically redraw. To achieve responsiveness
    // we must listen for the resize event on window and call the element's
    // requestRender method
    window.addEventListener('resize', (e) => {
      let wiredCards = document.getElementsByTagName('wired-card');
      let wiredButtons = document.getElementsByTagName('wired-button');
      let i;

      for (i = 0; i < wiredCards.length; i++) {
        wiredCards[i].requestRender();
      }

      for (i = 0; i < wiredButtons.length; i++) {
        wiredButtons[i].requestRender();
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }

  setUserId = (userId) => {
    this.setState({ userId });
  }

  connectToSocket = () => {
    // const socket = openSocketConnection('localhost:3001'); // For debugging
    const socket = openSocketConnection('206.189.74.63:3001'); // For Droplet

    this.setState({ socket });

    return socket;
  }

  render() {
    return (
      <div>
        <TopNav />
        <Switch>
          <Route exact path='/play' render={() => <GameContainer setUserId={this.setUserId} userId={this.state.userId} socket={this.state.socket} connectToSocket={this.connectToSocket}/>} />
          <Route exact path='/about' component={About} />
          <Route exact path='/help' component={Help} />
          <Route exact path='/team' component={Team} />
          <Route path='/' component={Welcome} />
        </Switch>
      </div>
    );
  }
}

export default App;
