import React from 'react';

const Team = () => {
  return (
    <main>
      <div className="main-content team">
        <h1>The Team</h1>
        <div>
          <ul>
            <li>
              <a href="https://brankoculum.github.io/">
                <figure>
                  <img src="https://avatars3.githubusercontent.com/u/22482600?s=460&v=4" alt="Branko Culum"/>
                </figure>
                <strong>Branko Culum</strong>
                  <br />
                  Software Engineer
                  <br />
                  Toronto, ON
              </a>
            </li>
            <li>
              <a href="https://ryannmcq.github.io/">
                <figure>
                  <img src="https://i.imgur.com/gZ2V9tF.jpg" alt="Ryann McQuilton"/>
                </figure>
                <strong>Ryann McQuilton</strong>
                  <br />
                  Software Engineer
                  <br />
                  Los Angeles, CA
              </a>
            </li>
            <li>
              <a href="https://joshcnelson.github.io">
                <figure>
                  <img src="https://i.imgur.com/fFPdyPZ.jpg" alt="Josh Nelson"/>
                </figure>
                <strong>Josh Nelson</strong>
                  <br />
                  Software Engineer
                  <br />
                  Portland, OR
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Team;
