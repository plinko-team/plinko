# Plinko.js

## Introduction

Plinko.js is a real-time, multiplayer, physics-based game using only JavaScript and the basic features of a browser. The clients and authoritative server communicate over WebSockets, and the game employ snapshots and extrapolation to synchronize game state across nodes. To optimize bandwidth, it compresses network data using quantization and binary serialization. The game lobby and player matchmaking system is built with React.

Check out the Plinko.js [case study](http://www.plinkojs.com/about) to learn more, or [play a demo game](http://www.plinkojs.com/play).

![Gameplay](https://i.imgur.com/EoyY370.gif)

## Installation

1) run `yarn install` in `/client`
2) run `npm install` in the root folder
3) run `npm run compile` to transpile the server side code
4) run `npm start` to run the development server on localhost:3000

## Case Study

Learn more about the project [here](http://www.plinkojs.com/about), including the challenges of application state synchronization and networked gaming in the browser.

## The Team

<img src="https://avatars3.githubusercontent.com/u/22482600?s=460&v=4" width="200" alt="Branko Culum"/>

**[Branko Culum](https://brankoculum.github.io/)**<br />
*Software Engineer*<br />
Toronto, ON

<img src="https://i.imgur.com/gZ2V9tF.jpg" width="200" alt="Ryann McQuilton"/>

**[Ryann McQuilton](https://ryannmcq.github.io/)**<br />
*Software Engineer*<br />
Los Angeles, CA

<img src="https://i.imgur.com/fFPdyPZ.jpg" width="200" alt="Josh Nelson"/>

**[Josh Nelson](https://joshcnelson.github.io/)**<br />
*Software Engineer*<br />
Portland, OR
