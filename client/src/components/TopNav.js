import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  return (
    <div className="nav-container">
      <nav className="row">
        <div className="two columns offset-by-two">
          <NavLink to="about" className="button ">About</NavLink>
        </div>
        <div className="two columns">
          <NavLink to="play" className="button">Play</NavLink>
        </div>
        <div className="two columns">
          <NavLink to="team" className="button">Team</NavLink>
        </div>
        <div className="two columns">
          <NavLink to="help" className="button">Help</NavLink>
        </div>
        <div className="two columns">
          <a href="https://github.com/plinko-team/plinko" className="button">GitHub</a>
        </div>
      </nav>
    </div>
  )
}

export default TopNav;
