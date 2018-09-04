import React from 'react';

import Aside from './Aside';

const Help = () => {
  return (
    <main>
      <div className="main-content">
        <h1>Help</h1>
        <h2>Gameplay</h2>
        <p>Use your mouse to drop chips into the game frame. When your chip hits a peg, the peg will change to match your player color. The more pegs you own, the higher your score.</p>

        <Aside>
          <h3>Objective</h3>
          <p>Keep an eye on the target score above the gameboard, and hit the pegs as fast as you can to reach the target. The target score is a percentage of pegs, and it drops continuously as you play.</p>

          <h4>Multiplayer</h4>
          <p>Reach the target score before anyone else. But watch out! Other players might steal your pegs.</p>

          <h4>Single Player</h4>
          <p>Reach the target score as fast as you can. See if you can hit 80% of pegs before time runs out. How about 90%?</p>
        </Aside>

        <h2>Supported Browsers</h2>
          <p>Plinko.js is optimized for <a href="https://www.google.com/chrome/">Chrome</a>, but may also be played in Firefox or Safari. You can play on mobile or desktop, though you'll probably find the game experience more enjoyable on a larger screen.</p>

        <h2>Technical Issues</h2>
          <p>If gameplay seems to lag, it's likely you're experiencing a slow connection and aren't receiving timely game state updates. Try another device or network if you can.</p>
          <p>If you encounter any other difficulties, please open an issue on <a href="https://github.com/plinko-team/plinko">GitHub</a> so the team can investigate.</p>
      </div>
    </main>
  )
}

export default Help;
