import React from 'react';

const Team = () => {
  return (
    <main>
      <div className="main-content">
        <h1>The Team</h1>
        <div>
          <ul className="team">
            <li>
              <a href="#">
                <figure>
                  <img src="https://via.placeholder.com/200x200" alt="Branko Culum"/>
                </figure>
                <strong>Branko Culum</strong>
                  <br />
                  Software Engineer
              </a>
            </li>
            <li>
              <a href="#">
                <figure>
                  <img src="https://via.placeholder.com/200x200" alt="Ryann McQuilton"/>
                </figure>
                <strong>Ryann McQuilton</strong>
                  <br />
                  Software Engineer
              </a>
            </li>
            <li>
              <a href="#">
                <figure>
                  <img src="https://i.imgur.com/2ZDRwrh.jpg" alt="Josh Nelson"/>
                </figure>
                <strong>Josh Nelson</strong>
                  <br />
                  Software Engineer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Team;
