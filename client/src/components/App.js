import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import GameContainer from './GameContainer';
import TopNav from './TopNav';
import Welcome from './pages/Welcome';
import About from './pages/About';
import Team from './pages/Team';

class App extends Component {
  render() {
    return (
      <div>
        <TopNav />
        <Switch>
          <Route exact path='/play' component={GameContainer} />
          <Route exact path='/about' component={About} />
          <Route exact path='/team' component={Team} />
          <Route path='/' component={Welcome} />
        </Switch>
      </div>
    );
  }
}

export default App;
