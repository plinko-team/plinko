import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  return (
    <div className="nav-container">
      <nav className="row">
        <NavLink to="about" className="button two columns offset-by-four">About</NavLink>
        <NavLink to="play" className="button two columns">Play</NavLink>
        <NavLink to="team" className="button two columns">Team</NavLink>
        <a href="https://github.com/plinko-team/plinko" className="button two columns">GitHub</a>
      </nav>
    </div>
  )
}

export default TopNav;
