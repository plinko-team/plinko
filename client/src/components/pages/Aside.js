import React, { Component } from 'react';
import { WiredCard } from 'wired-elements';

export default class Aside extends Component {
  cardStyles = {
    width: '100%',
  }

  render() {
    return (
      <wired-card style={this.cardStyles} elevation='3'>
        <aside>
          {this.props.children}
        </aside>
      </wired-card>
    )
  }
}
