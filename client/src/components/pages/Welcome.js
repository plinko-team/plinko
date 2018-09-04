import React from 'react';

const Welcome = () => {
  return (
    <main>
      <div className="main-content welcome">
        <h1>Welcome!</h1>
        <p>Plinko.js is a real-time, multiplayer, physics-based game played in the browser and built with Node, React, and WebSockets.</p>

        <p>Read the <a href="/about">case study</a> to learn more about Plinko.js, including networked game architecture, state synchronization, and data compression  strategies.</p>

        <ul>
          <li><a href="/about">Read more</a></li>
          <li><a href="/play">Play the game</a></li>
          <li><a href="/team">Meet the team</a></li>
          <li><a href="/help">Get help</a></li>
          <li><a href="https://github.com/plinko-team/plinko">Fork on GitHub</a></li>
        </ul>
      </div>
    </main>
  )
}

export default Welcome;
