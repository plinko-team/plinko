import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import GameContainer from './GameContainer';
import TopNav from './TopNav';
import Welcome from './pages/Welcome';
import About from './pages/About';
import Team from './pages/Team';

class App extends Component {
  state = {
    uuid: undefined,
  }

  setUserId = (userId) => {
    this.setState({ userId });
  }

  render() {
    return (
      <div>
        <TopNav />
        <Switch>
          <Route exact path='/play' render={() => <GameContainer setUserId={this.setUserId} userId={this.state.userId} />} />
          <Route exact path='/about' component={About} />
          <Route exact path='/team' component={Team} />
          <Route path='/' component={Welcome} />
        </Switch>
      </div>
    );
  }
}

export default App;
