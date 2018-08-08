import React from 'react';

import Header from '../Header';

const Help = () => {
  return (
    <main>
      <Header />
        <div className="main-content help">
          <h2>Help</h2>
          <h3>Objective</h3>
          <p>Hit as many pegs as you can to turn them your color.</p>

          <h3>Playing against friends?</h3>
          <p>Hit the target peg percentage before anyone else. 
            Watch out! Other users can steal your pegs.
          </p>

          <h3>Playing alone?</h3>
          <p>Try to hit the target peg percentage as close to 100% 
            as you can.
          </p>
        </div>

    </main>
  )
}

export default Help;
