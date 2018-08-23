import React from 'react';
import { NavLink } from 'react-router-dom';
import { WiredButton } from 'wired-elements';

const buttonStyles = {

}

const TopNav = () => {
  return (
    <div className="nav-container">
      <nav className="row">
        <div className="two columns offset-by-two">
          <NavLink to="about">
            <wired-button style={buttonStyles} elevation='2'>Case Study</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <NavLink to="play">
            <wired-button style={buttonStyles} elevation='2'>Play</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <NavLink to="help">
            <wired-button style={buttonStyles} elevation='2'>Help</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <NavLink to="team">
            <wired-button style={buttonStyles} elevation='2'>The Team</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <a href="https://github.com/plinko-team/plinko">
            <wired-button style={buttonStyles} elevation='2'>Github</wired-button>
          </a>
        </div>
      </nav>
    </div>
  )
}

export default TopNav;
