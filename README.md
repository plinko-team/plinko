# Plinko.js

## Introduction

Plinko.js is a real-time, multiplayer, physics-based game using only JavaScript and the basic features of a browser. The clients and authoritative server communicate over WebSockets, and the game employ snapshots and extrapolation to synchronize game state across nodes. To optimize bandwidth, it compresses network data using quantization and binary serialization. The game lobby and player matchmaking system is built with React.

For more information, read our [case study](http://www.plinkojs.com/about)

Click here to play a [demo](http://www.plinkojs.com/play)!

![Gameplay](https://s1.gifyu.com/images/giphy38d141392504b7f2.gif "Gameplay")

## Installation
1) run `yarn install` in `/client`
2) run `npm install` in the root folder
3) run `npm run compile` to transpile the server side code
4) run `npm start` to start the server! You can now play the game at localhost:3000

_Note: If you wish to run the server somewhere other than local host, you must change `localhost:3001`_ in `client/src/components/App.js` to your domain at port 3001

## Case Study
Learn more about Plinko.js [here](http://www.plinkojs.com/about).

## About Us
Our team of three web developers built Plinko remotely, working together from across North America. We pair-programmed, bug-squashed, and drank 3,425,718 cups of coffee.

<img src="https://avatars3.githubusercontent.com/u/22482600?s=460&v=4" width="200" alt="Branko Culum"/>

**Branko Culum**<br />
*Software Engineer*<br />
Toronto, ON

<img src="https://i.imgur.com/wZIIsLM.jpg =200x200" width="200" alt="Ryann McQuilton"/>

**Ryann McQuilton**<br />
*Software Engineer*<br />
Los Angeles, CA

<img src="https://i.imgur.com/2ZDRwrh.jpg" width="200" alt="Josh Nelson"/>

**Josh Nelson**<br />
*Software Engineer*<br />
Portland, OR

Please feel free to get in touch if you’d like to talk software engineering, games, or the web. We’re always open to learning about new opportunities.
