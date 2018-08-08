import React from 'react';

import Header from '../Header';

const Help = () => {
  return (
    <main>
      <Header />
        <div className="main-content help">
          <h1>Help</h1>
          <h2>Gameplay</h2>
          <p>Use your mouse to drop chips into the game frame. When your chip hits a peg, the peg will change to match your player color. The more pegs you own, the higher your score.</p>

          <div className="left-rule">
            <h3>Objective</h3>
            <p>Hit the pegs as fast as you can to reach the target score. The target is a percentage of pegs, and it drops continuously as you play.</p>

            <h3>Multiplayer</h3>
            <p>Reach the target score before anyone else. But watch out! Other players might steal your pegs.</p>

            <h3>Single Player</h3>
            <p>Reach the target score as fast as you can. See if you can you hit 90% of pegs before time runs out. How about 95%?</p>
          </div>

          <h2>Supported Browsers</h2>


          <h2>Technical Issues</h2>
        </div>

    </main>
  )
}

export default Help;
