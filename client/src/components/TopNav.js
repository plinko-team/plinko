import React from 'react';
import { NavLink } from 'react-router-dom';
import { WiredButton } from 'wired-button';

import LogoCircle from './LogoCircle';

const TopNav = () => {
  return (
    <div className="nav-container">
      <nav className="row">
        <div className="two columns offset-by-two">
          <NavLink to="about">
            <wired-button elevation='2'>Case Study</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <NavLink to="play">
            <wired-button elevation='2'>Play</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <NavLink to="help">
            <wired-button elevation='2'>Help</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <NavLink to="team">
            <wired-button elevation='2'>The Team</wired-button>
          </NavLink>
        </div>
        <div className="two columns">
          <a href="https://github.com/plinko-team/plinko">
            <wired-button elevation='2'>Github</wired-button>
          </a>
        </div>
      </nav>

      <header>
        <h1 className="">
          <NavLink to="/">
            Plinko
            <LogoCircle />
          </NavLink>
        </h1>
      </header>
    </div>
  )
}

export default TopNav;
