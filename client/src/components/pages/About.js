import React from 'react';
import Slider from "react-slick";
import SyntaxHighlighter from 'react-syntax-highlighter';

import Aside from './Aside';
import Citation from './Citation';

const About = () => {
  const syntaxHighlighterProps = {
    useInlineStyles: false,
    language: 'javascript',
  };

  const sliderSettings = {
    dots: true,
    fade: true,
    infinite: true,
    swipeToSlide: true,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const whileLoopSnippet = `while (gameIsRunning) {
  processInputs()
  updateWorld()
  renderWorld()
}`;

  const gameLoopRAF = `function gameLoop() {
  requestAnimationFrame(gameLoop)

  processInputs()
  updateWorld()
  renderWorld()
}`;

  const gameLoopComplete = `function gameLoop() {
  requestAnimationFrame(gameLoop)

  // elapsedTime describes how much time the last game loop took
  let elapsedTime = currentTime() - lastFrameTime

  // MAX_ELAPSED_TIME ensures the renderer doesn't fall too far
  // behind the simulation in the event of a processing spike
  if (elapsedTime > MAX_ELAPSED_TIME) {
    elapsedTime = MAX_ELAPSED_TIME
  }

  accumulatedTime += elapsedTime

  while (accumulatedTime >= TIMESTEP) {
    // Advance the simulation by our fixed TIMESTEP, 16.67ms
    updateWorld(TIMESTEP)
    accumulatedTime -= TIMESTEP
  }

  // alpha is a value between 0 and 1 that represents
  // how far along the game loop is between the previous
  // and current simulation steps

  const alpha = accumulatedTime / TIMESTEP
  interpolate(alpha)
  renderWorld()

  lastFrameTime = currentTime()
}`;

  const animate = `function animate() {
  // ...

  // Get the latest snapshot received from the server
  const currentSnapshot = getSnapshot()

  // Iterate over all chips that exist in the snapshot
  currentSnapshot.chips.forEach(chipInfo => {
    if (chipAlreadyExists()) {
      // If this is an existing chip, update its properties with the
      // data from the snapshot
      updateExistingChip(chipInfo)
    } else {
      // If this is a new chip the client hasn't seen yet, create a
      // new chip object and add it to the renderer
      createNewChip(chipInfo)
      addChipToRenderer()
    }
  })

  renderGame()

  // ...
}`;

  const animateWithBuffer = `function animate() {
  // ...

  // If there are more than 5 frames in the buffer, the client is too
  // far behind the server and should throw away excess frames to get
  // back in sync
  while (snapshotBuffer.length > 5) { snapshotBuffer.shift() }

  // Get the first snapshot received from the server that hasn't been
  // processed yet
  const currentSnapshot = snapshotBuffer.shift()

  // If no snapshot exists to be processed, do not render a new frame
  if (!currentSnapshot) { return }

  // Otherwise, iterate over all chips that exist in the snapshot
  currentSnapshot.chips.forEach(chipInfo => {
    // Update chip or create a new one, same as before
  })

  renderGame()

  // ...
}`;

  const beforeSerializationSnippet = `{
  id: 255,
  x: 752.34235235235,
  y: 492.42452311111,
  angle: 3.535450564755286
}`;

  const afterSerializationSnipper = `'{
  "id":255,
  "x":752.34235235235,
  "y":492.42452311111,
  "angle":3.535450564755286
}'`;

  const binarySnippet = `
11111111
1011110000
0111101100
0110111001111

`;

  const animateClientReenactment = `function animate() {

  if (latestSnapshotExists()) {

    const snapshot = getLatestSnapshot()

    // Regenerate world from latest snapshot then catch up
    // to the current frame
    regenerateFromSnapshot(snapshot)
    catchUpToCurrentFrameFrom(snapshot.frame)

    // Make room for next snapshot
    deleteLatestSnapshot()
  }

  // Always move the engine ahead one step
  // because we are always extrapolating

  updateWorld()
  incrementFrame()
}`;

  const regenerateFromSnapshot = `function regenerateFromSnapshot(snapshot) {
  snapshot.chips.forEach(chipInfo => {

    if (chipDoesNotExist()) { createChip(chipInfo) }

    // Get a reference to the chip, either newly created or
    // already existing
    const chip = getChipById(chipInfo.id)

    // Adjust physical properties based on snapshot's properties
    updateChipProperties(chip, chipInfo)
  })
}`;

  const catchUpToCurrentFrameFrom = `function catchUpToCurrentFrameFrom(frame) {
  // Indicate that we should not render reenactment steps
  toggleReenactmentOn()

  // Fast-forward up to current frame with the engine
  while (frame < currentFrame()) {
    incrementFrame()
    updateWorld()
  }

  toggleReenactmentOff()
}`;

  const implementationSnippet = `function animate() {
  if (inputBufferNotEmpty()) {
    const frame = inputBuffer.earliestFrame()

    // Empty inputBuffer into inputHistory
    while (inputBufferNotEmpty()) {
      // Get first input
      const input = inputBuffer.shift()

      // Store it according to its frame in inputHistory
      inputHistory.add(input)
    }

    // Get snapshot for frame of first input in buffer
    const snapshot = snapshotHistory.at(frame)

    // Rewind
    restoreWorldFromSnapshot(snapshot)
    // Reenact
    catchUpToCurrentFrameFrom(frame)
  }

  updateWorld()
  incrementFrame()
}`;

  const restoreWorldFromSnapshot = `function restoreWorldFromSnapshot(snapshot) {

  snapshot.chips.forEach(chipInfo => {

    // Category 1; new chips
    if (chipIsNewToWorld()) { createChip(chipInfo) }

    // Category 2; update chips
    const chip = getChipFromWorldById(id)
    chip.updateProperties(chipInfo)
  })

  // Category 3; remove chips
  deleteChipsNotInSnapshot()
}`;

  const catchUpToCurrentFrameFromServerSide = `function catchUpToCurrentFrameFrom(frame) {
  // frame is the frame from the first buffered input

  while (frame < currentFrame()) {

    // If there are inputs at the current frame, we need to
    // process them by creating and adding chips to the world
    const inputs = inputsAtCurrentFrame()

    if (inputs) {
      inputs.forEach(input => createChip(input))
    }

    // Our snapshot history keeps a snapshot for every frame
    // Now that we've modified the past state, it needs to be
    // overwritten
    const generatedSnapshot = generateSnapshot()
    snapshotHistory.update(frame, generatedSnapshot)

    // Finally, we move the engine forward by one tick
    updateWorld()
    incrementFrame()
  }

  // After the while loop has executed, our world state will be
  // back at the current frame, including the new inputs
}`;

  const bendingImplementation = `// Determine the number of frames before the position will converge
const totalBendingFrames = 4
let bendingFrame = 1
let bendingFactor
let deltaX
let deltaY

while (bendingFrame !== totalBendingFrames) {
  // Calculate bending factor. It can be a constant factor,
  // or dependent on number of bending frames
  bendingFactor = 1 / (totalBendingFrames - bendingFrame)

  // Calculate the distance between new and old position
  deltaX = simulatedPosition.x - renderedPosition.x
  deltaY = simulatedPosition.y - renderedPosition.y

  // Update rendered position
  renderedPosition.x += deltaX * bendingFactor
  renderedPosition.y += deltaY * bendingFactor

  updateWorld()
  bendingFrame++
}`;

  return (
    <main>
      <div className="main-content">
        <h1>Case Study</h1>

        <div className="toc">
          <Aside emphasized={true}>
            <ol>
              <li>
                <a href="#introduction">Introduction</a>
                  <ol>
                    <li><a href="#design-goals">Design Goals</a></li>
                  </ol>
              </li>
              <li>
                <a href="#browser-game">Building a Browser Game</a>
                <ol>
                  <li><a href="#game-loops">Game Loops</a></li>
                </ol>
              </li>
              <li>
                <a href="#network-architecture">Network Architecture</a>
                <ol>
                  <li><a href="#client-server">Client-Server Architecture</a></li>
                  <li><a href="#websockets">WebSockets</a></li>
                </ol>
              </li>
              <li>
                <a href="#syncing-state">Synchronizing Networked Game State</a>
                <ol>
                  <li><a href="#inputs">Transmitting Inputs</a></li>
                  <li><a href="#snapshots">Transmitting the Entire Game State</a></li>
                  <li><a href="#prediction">Predicting the Game State</a></li>
                </ol>
              </li>
              <li>
                <a href="#finished-game">Finished Game</a>
              </li>
              <li>
                <a href="#future-work">Future Work</a>
              </li>
              <li>
                <a href="#about-us">About the Team</a>
              </li>
              <li>
                <a href="#further-reading">Further Reading</a>
              </li>
            </ol>
            <div className="p">Hover over <Citation creator="Sample Creator" title="Sample Title" /> for citations</div>
          </Aside>
        </div>

        {/* Introduction */}

        <h2 id="introduction">1 Introduction</h2>
        <div className="p">Plinko.js is a real-time, multiplayer, networked physics game that can be
           played in the browser with no special plugins. We built the game and game
           management with JavaScript, using Node and React, with clients and
           server communicating over WebSockets.
        </div>
        <div className="p">The major challenges we faced were synchronizing game state over the
          internet between multiple clients in real time, while facilitating
          live-action gameplay – all while relying only on the basic features
          of a browser. We crafted the game state synchronization architecture
          and algorithms from scratch, using no client-side plugins.
        </div>
        <div className="p">Here, we'll explore how we built a browser-based game,
          strategies to synchronize game state in real time, and our final
          networked implementation. We’ll also discuss optimizations we leveraged,
          including protocol strategies, binary serialization, and latency
          estimation.
        </div>
        <figure>
          <img className="medium" src="https://media.giphy.com/media/1rRkqtfEgsK57mgN52/giphy.gif" alt="Plinko Gameplay" />
          <figcaption>Actual recorded gameplay</figcaption>
        </figure>

        <h3 id="design-goals">1.2 Design Goals</h3>
        <div className="p">Gameplay is similar to real-life Plinko, but with a twist.</div>
        <div className="p">Up to four players may click to drop chips into the top of the game frame
           at the same time, and the goal is to hit as many pegs as you can to change
           them to your own color. The first player to activate enough pegs to hit
           the target score wins. The target score is a percentage of the total
           number of pegs – it starts at 100%, and it drops as the game progresses.
           If you’re playing alone, the game becomes a race against the clock.
        </div>
        <div className="p">Since gameplay requires multiple players to drop as many chips as possible
           as quickly as they can, we know we need to handle a lot of traffic and a
            fast-moving game state. We must:
        </div>
        <ul>
          <li>Maintain real-time gameplay between multiple players and the illusion
              of a lag-free environment with latencies as high as 100-200ms
          </li>
          <li>Optimize bandwidth and throughput to support a wide variety of possible
              connection speeds
          </li>
          <li>Manage a constantly changing divergent game state</li>
        </ul>

        {/* Building a Browser Game */}

        <h2 id="browser-game">2 Building a Browser Game</h2>
        <div className="p">Our first task is to create a single-player version of our real-time game that runs in a user’s local browser, using no special plugins or game networking frameworks.</div>
        <div className="p">To start, any game must take three basic steps:</div>
        <ol>
          <li>Accept player inputs</li>
          <li>Use those inputs to simulate a game world</li>
          <li>Show the updated game world to the player</li>
        </ol>
        <div className="p">In our game, players make inputs by clicking inside the game frame. A click creates a new chip, which will make its way through the pegs toward the bottom of the frame. That’s step one.</div>
        <div className="p">But how exactly does the chip <em>make its way</em>? In a physics-based game like ours, a physics engine is responsible for simulating the game world. We use Matter.js, a 2D rigid body physics engine written in JavaScript. Matter provides simulated gravity, friction, and other forces for our new chip to interact with. It lets us calculate, given certain conditions, where any chip should be at any moment in time. That’s step two.</div>
        <div className="p">Finally, it’s not enough for our app to know what’s happening to a chip. We have to actually show it to the player! Existing rendering libraries have limitations for our game and/or excess functionality that would slow us down, so we decided to write our own renderer using HTML5 Canvas and Rough.js, a graphics library with a hand-sketched feel. The Canvas API lets us connect the calculations of our physics engine directly to the browser’s drawable canvas element. That’s step three, and we’re in business… almost.</div>


        <h3 id="game-loops">2.1 Game Loops</h3>
        <div className="p">Our game can’t just take the three game steps once and call it a day. If we want it to run in real time, it must take those steps continuously.</div>

        <h4 id="211-Looping-Physics">2.1.1 Looping Physics</h4>
        <div className="p">In real life, physics is continuous by nature. Imagine dropping a real plastic chip into a real frame full of wooden pegs. How many positions in space will that chip occupy on its way down? The answer isn’t quantifiable – the chip will exist at an incalculable number of points between the top of the frame and the bottom.</div>
        <div className="p">A physics simulation needs to model this behavior, but we can’t ask it to calculate incalculable data. Instead, it needs to calculate the position of the chip at a discrete moment in time, then at a moment a little while after, then one a little after that. When we see these positions all in row, we get the illusion of continuous movement.</div>

        <figure>
          <img className="small" src="https://i.imgur.com/QnL9rtT.png" alt="Simulated Chip Positions" />
          <figcaption>A single chip’s positions at discrete points in time</figcaption>
        </figure>

        <div className="p">Here’s one simple idea:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {whileLoopSnippet}
        </SyntaxHighlighter>

        <div className="p"><code>while</code> loops run repeatedly, as fast as the computer’s processor can manage. This means we have a problem right away: the game will run more slowly on a slow computer than on a fast one. Instead, we need some way to get consistent performance for any machine. That means moving the simulation forward at the same speed for any user, regardless of processing power. We can achieve this with a <strong>fixed timestep</strong>.</div>

        <h4 id="212-Timesteps">2.1.2 Timesteps</h4>
        <div className="p">A timestep provides specific instructions for the physics engine. It’s the amount of time that the engine should move the world forward in each step. It’s essential that the timestep be fixed, which means the exact same length of time is simulated in every loop. Unlike the <code>while</code> loop, a fixed timestep:</div>
        <ul>
          <li>Is deterministic for the same user in the same browser</li>
          <li>Allows us to decouple rendering graphics from simulating the game</li>
        </ul>

        <div className="p">We want to display our game at 60 frames per second to provide a smooth, realistic visual experience for players.
          <Citation
            creator={'Samit Sarkar'}
            creationDate={"June 05, 2014"}
            title={'Why frame rate and resolution matter: A graphic primer'}
            contributingOrganization={'Polygon'}
            url={"https://www.polygon.com/2014/6/5/5761780/frame-rate-resolution-graphics-primer-ps4-xbox-one"}
          />
          To achieve this, we’ll advance the physics simulation at a fixed rate of 16.67 milliseconds in each frame (1000 milliseconds / 60 fps).
        </div>

        <h4 id="213-Frame-Rate-Independence">2.1.3 Frame Rate Independence</h4>
        <div className="p">Currently, our physics engine steps forward and the game is rendered on every single frame. A loop that renders and updates the simulation at the same time can work well as long as conditions are ideal, but a user with a particularly fast processor will experience a faster moving physics simulation. Likewise, a slower computer will result in a sluggish physical environment.</div>
        <div className="p">Let’s consider an example where, due to heavy computational load, it takes 100ms of real time to run a single step of our game loop. Essentially, 100ms have passed in the real world, but the physics simulation has only moved forward 16ms. In 100ms, we would expect six frames to be simulated and rendered, but instead our game only generates one. If this happens multiple times in a row, the frame rate will drop and the game world will actually appear to <em>slow down</em>.</div>
        <div className="p">Even if our display frame rate is lowered, we still need the physics engine to simulate 100ms when 100ms have elapsed. Otherwise, the motion on the screen will be jittery. The speed of a chip should only depend on its physical properties, not the speed of the computer running it.
          <Citation
            creator={'Koen Witters'}
            creationDate={"July 13, 2009"}
            title={'deWiTTERS Game Loop'}
            url={"https://www.koonsolo.com/news/dewitters-gameloop/"}
          />
        </div>
        <div className="p">The solution is to decouple the renderer from the physics engine. This entails keeping track of how much time has elapsed since the previous game loop, and, if necessary, stepping the simulation forward multiple times before rendering the next frame.</div>

        <h4 id="213-requestAnimationFrame">2.1.3 <code>requestAnimationFrame</code></h4>
        <div className="p">Now that we have our game loop goals in mind, your first instinct might be to implement the loop using <code>setInterval</code> or <code>setTimeout</code>. But remember that we need to run our game on a fixed timestep, and neither of these methods are guaranteed to execute the callback at the exact delay time we pass in. Instead, this delay will be the <em>minimum</em> amount of time it takes for the callback to be executed. Actual execution time will depend on how many other tasks are also waiting in the queue.
          <Citation
            title={'Concurrency model and Event Loop'}
            contributingOrganization={'Mozilla Developer Network'}
            url={"https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#Zero_delays"}
          />
        </div>
        <div className="p">Inexact callback timing isn’t only detrimental to our fixed timestep – it will also cause rendering problems in the browser. Browsers typically repaint pages every 16.67ms, and if our almost-but-not-exactly-16.67ms game loop gets out of sync with the repaint schedule, players may experience skipped frames and other unpleasant visual artifacts. If we run our loop more often than every 16.67ms to account for this, we end up trying to render more frequently than the browser is able to repaint, creating unnecessary computation.</div>
        <div className="p">Luckily, there’s a better option. <code>requestAnimationFrame</code> is a JavaScript browser method on <code>window</code> that’s optimized for looping animation. It lets us pass in a callback, which will be executed before the browser’s next repaint. We’ll pass in the function we use to increment our game engine, and we’ll create a loop by calling <code>requestAnimationFrame</code> recursively inside the callback. Here’s a simplified look at our new looping architecture:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {gameLoopRAF}
        </SyntaxHighlighter>

        <div className="p">Now we’re controlling <em>what</em> to animate – our updated world – but letting the browser handle <em>when</em> to animate, which will occur at its natural 60fps repaint rate. The result is a smoother visual experience for players. You can see the difference in the animations below, which contrast <code>requestAnimationFrame</code> with a loop created using <code>setTimeout</code>:</div>

        <figure>
          <img src="https://s1.gifyu.com/images/ezgif-4-25e4c4895b.gif" alt="requestAnimationFrame" />
          <img src="https://s1.gifyu.com/images/ezgif-4-364b79fa2d.gif" alt="setTimeout" />
          <figcaption><code>requestAnimationFrame</code> renders at a smooth 60fps, while <code>setTimeout</code> creates an unpredictable frame rate</figcaption>
        </figure>

        <div className="p"><code>requestAnimationFrame</code> also provides other optimizations, like pausing animation when a tab is out of focus to conserve player CPU resources and battery life.</div>

        <h4 id="214-Putting-It-All-Together">2.1.4 Putting It All Together</h4>
        <div className="p">By now, we know our game loop must make use of a few key strategies:</div>
        <ul>
          <li>A fixed timestep</li>
          <li><code>requestAnimationFrame</code></li>
          <li>Frame rate independence</li>
        </ul>
        <div className="p">We’ll also introduce one final idea: now that we’ve decoupled our physics simulation from our renderer, it’s possible that we’ll be ready to render a new frame when the physics engine is still somewhere in between two steps. If this is the case, we need to <strong>interpolate</strong> between these steps – in other words, ask the physics engine to calculate the game world <em>in between</em> the two steps, at the moment in time we’d like to render.</div>
        <div className="p">You can see how this works in the pseudocode for our final game loop implementation:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {gameLoopComplete}
        </SyntaxHighlighter>

        <ul>
          <li>We track <code>elapsedTime</code> to capture how long the previous loop took</li>
          <li>If <code>elapsedTime</code> is too big (a processing spike occurred), we cap it with <code>MAX_ELAPSED_TIME</code> so that we don’t simulate too much time</li>
          <li><code>accumulatedTime</code> is how we track how much time has passed since the last physics simulation.</li>
          <li>If <code>accumulatedTime</code> is greater than <code>TIMESTEP</code> we know that enough time has passed to advance the simulation forward</li>
          <li>Knowing our <code>alpha</code>, how far we are between simulations, allows us to  interpolate between simulation points</li>
        </ul>

        {/* Network Architecture */}

        <h2 id="network-architecture">3 Network Architecture</h2>
        <div className="p">We’ve built a fully-functioning local physics game for a single player, but that’s only the first step. We want to let multiple users play together in the same game world, which means we need to network our game.</div>

        <h3 id="client-server">3.1 Client-Server Architecture</h3>
        <div className="p">We’ll use a client-server networking model, where all players connect to a central server that acts as the authority on the game state (in contrast to peer-to-peer networking, where players connect to one another and there is no central authority).</div>
        <figure>
          <img className="medium" src="https://i.imgur.com/0JXCE2e.png" alt="Client-Server architecture" />
        </figure>
        <div className="p">Connected players transmit inputs to the server. The server, in turn, sends the necessary game state information to all connected clients so that they can recreate the game state locally.</div>
        <div className="p">Thanks to a few chief benefits, client-server architecture is the gold standard in multiplayer gaming.
          <Citation
            creator={'Gabriel Gambetta'}
            title={'Fast-Paced Multiplayer (Part I): Client-Server Game Architecture'}
            url={"http://www.gabrielgambetta.com/client-server-game-architecture.html"}
          />
        </div>

        <ul>
          <li>Server provides a single source of authority
          <ul>
            <li>Easier to reconcile conflicts</li>
            <li>Easier to manage game state</li>
          </ul>
          </li>
          <li>Reduced avenues for cheating</li>
          <li>Connections are more reliable</li>
        </ul>
        <div className="p">There are some tradeoffs to this approach. For one, we have to provide and maintain the servers, and scale them if we want our game to grow. Network communication can also be slower than for peer-to-peer connections: instead of communicating directly with one another, data from one client to another must route through the server first.</div>
        <div className="p">Still, the advantages mentioned above are significant, and the pros typically outweigh the cons when it comes to gaming.
          <Citation
            creator={'Sergey Ignatchenko'}
            creationDate={"July 7, 2017"}
            title={'Development and Deployment of Multiplayer Online Games, Vol 1'}
            publisher={'ITHare'}
          />
        </div>

        <h3 id="websockets">3.2 WebSockets</h3>
        <div className="p">Now that we have our network in place, how will we facilitate communication between our server and clients? We want to run our game at 60 frames per second, which requires transmitting large amounts of data between client and server very quickly.</div>
        <div className="p">HTTP is an obvious protocol choice for most apps, but it isn’t well suited to our needs. It operates on a request-response cycle, and it must open and close a new connection for each new cycle. When we’re sending messages 60 times a second, this constant opening and closing will slow us down.</div>
        <div className="p">WebSockets is built on TCP just like HTTP is, but it provides stateful, bidirectional, full-duplex communication between client and server. Either the client or server may initiate communication, and both may send messages to one another simultaneously – all over a single connection that remains open for the lifetime of the communication session. After an initial HTTP handshake to open the connection, the client and server may exchange only the relevant application data with no headers, which decreases message overhead.</div>
        <div className="p">These optimizations make it faster, and therefore a better choice for our game.
        <Citation
          creator={'David Luecke'}
          creationDate={"January 26, 2018"}
          title={'HTTP vs Websockets: A performance comparison'}
          url={"https://blog.feathersjs.com/http-vs-websockets-a-performance-comparison-da2533f13a77"}
        />
        <Citation
          creator={'Arun Gupta'}
          creationDate={"February 24, 2014"}
          title={'REST vs WebSocket Comparison and Benchmarks'}
          url={"http://blog.arungupta.me/rest-vs-websocket-comparison-benchmarks/"}
        />
        </div>

        <h4 id="321-socketio">3.2.1 Socket.io</h4>
        <div className="p">In order to leverage existing solutions for WebSockets, we utilize Socket.io, a robust Javascript library that serves as a WebSockets wrapper. In addition to a general WebSockets interface, Socket.io also provides capabilities for broadcasting to compartmentalized sockets, a critical feature for player matchmaking, and support for asynchronous I/O.</div>

        {/* Synchronizing Networked Game State */}

        <h2 id="syncing-state">4 Synchronizing Networked Game State</h2>
        <div className="p">Game state synchronization is the single biggest challenge in networked gaming. Once we have multiple users playing together in their browsers, how do we ensure they all see the same game world at the same time?</div>
        <div className="p">We’ll start small and build our way up to a robust solution.</div>

        <h3 id="inputs">4.1 Transmitting Inputs</h3>
        <div className="p">No matter what, we know we need to share information about inputs between users. If we don’t, how will they know what other players are doing?</div>
        <div className="p">We’ll use our central server to relay input messages from one client to another. Just like in our local single-player game, each player will have their own physics engine to simulate the game world. The game lifecycle looks like this:</div>

        <Slider {...sliderSettings}>
          <div>
            <img src="https://i.imgur.com/M3el5w6.png" alt="Illustration of client-server communication 1"/>
            <div className="legend">Step 1. A user clicks to drop a new chip</div>
          </div>
          <div>
            <img src="https://i.imgur.com/yuJqfTc.png" alt="Illustration of client-server communication 2" />
            <div className="legend">Step 2. The client sends a notification about the new chip to the server. Meanwhile, the client's physics engine starts moving the chip.</div>
          </div>
          <div>
            <img src="https://i.imgur.com/Tz1CSoB.png" alt="Illustration of client-server communication 3" />
            <div className="legend">Step 3. The server relays the input to other clients</div>
          </div>
          <div>
            <img src="https://i.imgur.com/bmlnS4f.png" alt="Illustration of client-server communication 4" />
            <div className="legend">Step 4. Other clients add the new chip to their engine and display it</div>
          </div>
        </Slider>

        <div className="p">We can think of this model as having “smart” clients and a “dumb” server:</div>
        <figure>
          <img className="small" src="https://i.imgur.com/7fJWXcr.png" alt="Smart Clients" />
        </figure>

        <div className="p">Unfortunately, we have a problem: the chip will start falling right away for player 1, but the other players won’t find out about it for anywhere from 20-300+ milliseconds due to the latency that’s inherent in communication over the internet. In the meantime, they’re dropping their own chips and their game engines are moving forward by several frames. If everyone finds out about each others’ chips at different times, each player’s game world is going to look a little different. What if two chips collide on one player’s screen, but not on another’s? The longer the game runs, the more the state will diverge. Pretty soon, two players’ games will look nothing alike.</div>

        <h4 id="411-Lockstep">4.1.1 Lockstep</h4>
        <div className="p">One solution to this problem is to constrain the client game engines to update at the same time. We’ll send inputs to the server just like above, but the server won’t broadcast them right away. Instead, on each frame it waits to receive inputs (or a notification that no input occurred) from every single player. Once it’s heard from everyone, it will broadcast the set of inputs for that frame. Then, and only then, may the clients render the frame. To render the next frame, the server and clients have to start this process over again.</div>
        <div className="p">This model is called <em>lockstep</em> because that’s exactly how the client engines move forward: together, in lockstep. It was one of the earliest approaches to networked gaming, and it’s still alive today in turn-based and strategy games.
          <Citation
            creator={'Glenn Fiedler'}
            creationDate={"February 24, 2010"}
            title={'What Every Programmer Needs To Know About Game Networking'}
            contributingOrganization={'Gaffer On Games'}
            url={"https://gafferongames.com/post/what_every_programmer_needs_to_know_about_game_networking"}
          />
          A big advantage is the small amount of bandwidth it tends to consume – no matter how complex the game world, we only need to network new inputs. But for an action or physics-based game like ours, it has two significant limitations:
        </div>
        <ol>
          <li>Everyone’s game will run at the speed of the slowest player connection</li>
          <li>Sending only inputs relies on <em>deterministic</em> behavior in the game engine</li>
        </ol>
        <div className="p">Even if we were willing to sacrifice speed (a big if in real-time gaming) determinism is non-negotiable.</div>

        <h5 id="412-Determinism">4.1.2 Determinism</h5>
        <div className="p">If our plan is to share new inputs among players and let their individual physics engines take care of the rest, we need be able to trust that each of those engines will produce exactly the same result. If we drop a chip in the same place at the same time under the same conditions, it should always behave in exactly the same way for every player.</div>
        <div className="p">However, the vast majority of physics engines, including ours, are <em>not</em> deterministic. Physics engines rely on floating point numbers to calculate physical properties and forces, and floating point numbers are handled differently by different machines and operating systems.
          <Citation
            creator={'Glenn Fiedler'}
            creationDate={"November 29, 2014"}
            title={'Deterministic Lockstep: Keeping simulations in sync by sending only inputs'}
            contributingOrganization={'Gaffer On Games'}
            url={"https://gafferongames.com/post/deterministic_lockstep/"}
          />
          If floating point calculations aren’t deterministic, our game won’t be either. A small disparity in rounding might cause a chip to bounce left for one user and right for another, and soon our players’ game states have diverged just like before.
        </div>
        <div className="p">At this point, it’s obvious that transmitting only inputs is not enough. How can we do better?</div>

        <h3 id="snapshots">4.2 Transmitting the Entire Game State</h3>
        <div className="p">If we can’t rely on every client’s physics engine to give us deterministic behavior, we need to take control of the physics engine ourselves. We have an authoritative server, so let’s use it as an authority. So far, we’ve been running a physics engine on each client and using the server as a relay. Instead, we can run a single physics engine on the server and use the clients only as displays – a “smart” server with “dumb” clients.</div>
        <figure>
          <img className="small" src="https://i.imgur.com/tMm113h.png" alt="Smart Server" />
        </figure>
        <div className="p">But if the clients are only responsible for rendering, how do they know <em>what</em> to render? For this to work, the server must continually broadcast snapshots of the entire game state for clients to display. Since clients no longer have their own physics engines, this is the only way they’ll know what’s happening in the game. It works like this:</div>

        <Slider {...sliderSettings}>
          <div>
            <img src="https://i.imgur.com/4VmSuMQ.png" alt="Illustration of client-server communication 1" />
            <div className="legend">1. A user clicks to drop a chip</div>
          </div>
          <div>
            <img src="https://i.imgur.com/rEzg6ql.png" alt="Illustration of client-server communication 2" />
            <div className="legend">2. The client notifies the server of a new input (note that the chip is not rendered yet)</div>
          </div>
          <div>
            <img src="https://i.imgur.com/RYWVIx1.png" alt="Illustration of client-server communication 3" />
            <div className="legend">3. The server’s physics engine updates the game world</div>
          </div>
          <div>
            <img src="https://i.imgur.com/Iv8PMhc.png" alt="Illustration of client-server communication 4" />
            <div className="legend">4. The server broadcasts a snapshot of the entire game state to all users</div>
          </div>
          <div>
            <img src="https://i.imgur.com/AyZlC3d.png" alt="Illustration of client-server communication 5" />
            <div className="legend">4. All users, including the one who dropped the chip, can now render the snapshot</div>
          </div>
        </Slider>

        <div className="p">A snapshot is like a page in a flipbook. Alone, it’s a still picture. But when you view many together in a sequence, they appear to animate. To achieve our 60fps frame rate, clients must receive 60 pictures every second. In our game, a snapshot is a JavaScript object containing the current positions and owners of all chips and pegs, plus game data like current scores and a timestamp. Here’s how the client uses these snapshots in the pseudocode for its <code>animate</code> function, which is called every 16.67 ms to animate the game:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {animate}
        </SyntaxHighlighter>

        <div className="p">With the snapshot approach, we’ve solved our state divergence problem. We can be confident all our players will see exactly the same game state, because there’s only one possible game state to see: the server’s. This is a huge improvement compared to our earlier attempt.</div>
        <div className="p">Unfortunately, a fully synchronized game state doesn’t come for free. The snapshot implementation introduces a few new problems of its own:</div>

        <h4 id="421-Network-Jitter">4.2.1 Network Jitter</h4>
        <div className="p">Ever experience the frustration of a stuttering video stream or a game that seems to skip through time? With snapshots, our game is going to jitter like this too. The server is broadcasting new frames every 16.67ms to achieve our 60fps frame rate, but there is no guarantee that our clients will receive them in the same regularly spaced intervals. In fact, the unpredictability of the internet all but guarantees that won’t happen.</div>
        <div className="p">If a client receives two snapshots right in a row, then none for a while, then another three all together, and so on, the game will appear jittery on screen. Luckily, we can mitigate this problem with a buffer.</div>

        <h5 id="4211-Solution-Snapshot-Buffer">Solution: Snapshot Buffer</h5>
        <div className="p">Right now, clients are rendering new snapshots as soon as they receive them. If they don’t get another one for a while, they’re stuck. Instead, we should have clients collect a few snapshots up front in a buffer before they begin rendering. That way, they’ll have a reserve of snapshots to use in the event of a spike in network latency.</div>
        <figure>
         <img src="https://i.imgur.com/KylqZjL.png" alt="Snapshot Buffer" />
         <figcaption>Visualization of client processing snapshots with and without a buffer</figcaption>
        </figure>
        <div className="p">Our buffer should function as a queue, so we’ll implement it using a singly linked list with references to both the head and tail. This gives us O(1) insertion at the tail and O(1) removal from the head.</div>
        <div className="p">Now that we have a buffer for snapshots, let’s update our pseudocode for the client’s <code>animate</code> function:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {animateWithBuffer}
        </SyntaxHighlighter>

        <h4 id="422-High-Bandwidth-Consumption">4.2.2 High Bandwidth Consumption</h4>
        <div className="p">In the lockstep approach, when we were transmitting only inputs over the network, our data needs were very small. Each new chip sent to the server required only a set of location coordinates and an ID to show which player dropped it. Once the server processed the chip and broadcast all inputs for a given frame, clients could expect to receive a maximum of one chip object per player.</div>
        <div className="p">With snapshots, the initial input data sent from client to server remains the same. However, the data broadcast back from the server is <em>much</em> larger. Now, the server must transmit the entire game world – all the chips, all the pegs, everything – to every player, 60 times every second. As you might imagine, this adds up quickly.</div>
        <div className="p">Let’s compare our bandwidth, assuming there are 200 chips in the game and a new one is added every second:</div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Lockstep</th>
                <th>Snapshots</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Bandwidth (kb/s)</th>
                <td>0.057</td>
                <td>900+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p">This is an enormous difference. Luckily, there are two ways we can shrink our bandwidth consumption while still enjoying the advantages of snapshots. The first way is to reduce the <em>size</em> of the data we transmit. After that, we’ll look at the other option: reducing the <em>frequency</em> of the data we transmit.</div>

        <h5 id="4221-Binary-Serialization">Solution: Binary Serialization</h5>
        <div className="p">In order to transmit data between clients and the server, the data must be converted into one of two formats that can be sent over the internet: a string, or a binary stream. This conversion process is called serialization.</div>
        <div className="p">So far, we’ve been relying on WebSockets to automatically serialize our JavaScript objects into transmittable JSON strings for us. For a single chip in a snapshot, it looks a little something like this:</div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <SyntaxHighlighter {...syntaxHighlighterProps}>
                    {beforeSerializationSnippet}
                  </SyntaxHighlighter>
                </td>
                <td>
                  <SyntaxHighlighter {...syntaxHighlighterProps}>
                    {afterSerializationSnipper}
                  </SyntaxHighlighter>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="figcaption">Note that JSON strings don’t actually include newlines or other whitespace. We show them here for readability.</div>

      <div className="p">The JSON string above is 76 characters, which means it takes 76 bytes to send over the network (1 byte per character). But if we put in some extra work to serialize our snapshots into binary, we can do <em>much</em> better.</div>
        <div className="p">Binary serialization is the process of compressing our complex game data into a series of 0s and 1s. We’ll craft our own binary serialization algorithm for the server to use, which must take care of serializing all the game data we need to send in snapshots: chips, pegs, the score, and other state.</div>
        <Aside emphasized={true}>
          <div className="p">Before we take a stab at binary serialization, there’s a quick optimization we can make. You probably noticed that the values in the chip above include floating point numbers, some with many digits after the decimal. If we leave them as-is, we’ll need to represent every single digit in binary, even though there’s little or no perceivable difference between a chip rendered at x = 752.34235235235 (47 bits when serialized to binary) and a chip rendered at x = 752 (10 bits when serialized).</div>

          <div className="p">To save ourselves some bits, we should <strong>quantize</strong> all our values before we serialize them. Here, quantization just means rounding to integers. (We do need to retain some decimals on the angle property for accuracy, so for that value we’ll round to three decimal points and multiply by 1000.)</div>
        </Aside>
        <div className="p">Let’s take that old chip string and see what it looks like after the server quantizes the values and converts them to binary:</div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <SyntaxHighlighter {...syntaxHighlighterProps}>
                    {afterSerializationSnipper}
                  </SyntaxHighlighter>
                </td>
                <td>
                  <SyntaxHighlighter {...syntaxHighlighterProps}>
                    {binarySnippet}
                  </SyntaxHighlighter>
                </td>
              </tr>
              <tr>
                <td>76 bytes (608 bits)</td>
                <td>8 bytes (41 bits)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p">Our chip has shrunk from 76 bytes to just 8 bytes. That’s a size reduction of almost 90%!</div>

        <h6 id="Deserialization"><em>De</em>-Serialization</h6>
        <div className="p">Once a client receives a serialized snapshot from the server, it must deserialize it before it can render the snapshot to the player. In order to deserialize a snapshot, the client and server must agree in advance on the format and length of the binary string. The client needs to know which bits refer to chips, which refer to pegs, and so on.</div>
        <div className="p">We’ll tell the client in advance how to break up this data to be parsed:</div>
        <figure>
          <img src="https://i.imgur.com/OFRLlrv.png" alt="Deserializing a Snapshot" />
          <figcaption>The first eight bits in the snapshot let the client know how many chips to expect. The next six give the number of pegs, and so on.</figcaption>
        </figure>
        <div className="p">Within the group of chips, how do we identify one individual chip? And in an individual chip, how do we know which bits represent its position, and which represent its ID or other data? Since we know one chip is 41 bits, we can zero in on the first 41 bits of the chip section:</div>
        <figure>
          <img src="https://i.imgur.com/OaAMwvE.png" alt="Deserializing a Chip" />
          <figcaption>Note that we divide the angle by 1000 to account for the fact that the server multiplied it by 1000 during quantization.</figcaption>
        </figure>

        <div className="p">When we’ve completed this deserialization process for the whole binary string, the client will have converted all values back into JavaScript objects that it can use to render the game world.</div>
        <div className="p">With binary serialization, a 15kb snapshot can be compressed to just 1.6kb. The data savings for our overall bandwidth is remarkable. Assuming 200 chips are in the game and we’re sending 60 snapshots per second:</div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>JSON</th>
                <th>Binary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Bandwidth (kb/s)</th>
                <td>900</td>
                <td>96</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h5 id="4222-Interpolation">Solution: Interpolation</h5>
        <div className="p">We’ve covered sending <em>less</em> data with binary serialization, but it’s also possible to send game state data <em>less frequently</em>. What if, instead of sending a snapshot of every frame, the server only sends a snapshot of every <em>other</em> frame?</div>
        <div className="p">We still want to animate our game at 60 frames per second for our players, so if clients only receive 30 frames per second, they will somehow need to create the missing frames on their own. The clients can achieve this by interpolating – guessing what happened – in between the frames they do receive. This strategy is called snapshot interpolation, and it effectively lets us chop our bandwidth consumption in half.</div>
        <div className="p">Here’s how it works in an ideal scenario:</div>

        <Slider {...sliderSettings}>
          <div>
            <img src="https://i.imgur.com/RnzV2EE.png" alt="A chip's path through game frame" />
            <div className="legend">The actual path the chip took in the server’s physics engine</div>
          </div>
          <div>
            <img src="https://i.imgur.com/KjfKhlf.png" alt="Frames received of chip's path" />
            <div className="legend">Frames sent from server to client as snapshots</div>
          </div>
          <div>
            <img src="https://i.imgur.com/xcqRzaN.png" alt="Interpolated frames of chip's path" />
            <div className="legend">Frames created by the client using linear interpolation</div>
          </div>
          <div>
            <img src="https://i.imgur.com/yhThQXf.png" alt="The actual path vs. the path rendered on client"/>
            <div className="legend">The path rendered for the player vs. the actual path on the server – not exact, but very close!</div>
          </div>
        </Slider>

        <div className="p">Here, the players will see the chip take almost the exact same path that it actually took in the server’s physics engine. Any small differences should be unnoticeable, and they’ll be corrected as soon as the client renders the next snapshot.</div>
        <div className="p">Unfortunately, interpolation won’t always give us such good results. Remember that the client is guessing now, and sooner or later one of those guesses is bound to be wrong. In the previous example, the client happened to receive a snapshot of the exact moment when the chip hit a peg, but there is no guarantee this will always be the case.</div>
        <div className="p">Imagine another scenario, where the chip takes the same path in the server engine, but the clients happen to receive different snapshots:</div>

        <Slider {...sliderSettings}>
          <div>
            <img src="https://i.imgur.com/8i7pRV4.png" alt="A chip's path through game frame" />
            <div className="legend">The actual path the chip took in the server’s physics engine, same as last time</div>
          </div>
          <div>
            <img src="https://i.imgur.com/Rr29rEU.png" alt="Frames received of chip's path" />
            <div className="legend">This time the server happens to send different frames as snapshots</div>
          </div>
          <div>
            <img src="https://i.imgur.com/ARRmY4o.png" alt="Interpolated frames of chip's path" />
            <div className="legend">So the client creates different frames using linear interpolation</div>
          </div>
          <div>
            <img src="https://i.imgur.com/vvMDmc0.png" alt="The actual path vs. the path rendered on client" />
            <div className="legend">The path rendered on the client vs. the actual path on the server – this time the chip appears to bounce right for no reason</div>
          </div>
        </Slider>

        <div className="p">Now the chip turns right in mid-air, but the players never see it hit a peg. It’s as if the peg has a forcefield around it, which creates a jarring, unnatural effect.</div>
        <div className="p">There is no simple solution to this problem. We could mitigate the risk of bad guesses by sending snapshots from the server more often, but this would defeat the purpose of using interpolation to reduce bandwidth in the first place.</div>

        <h4 id="423-Input-Lag">4.2.3 Input Lag</h4>
        <div className="p">Last, relying on snapshots to keep our game state synchronized can result in input lag for players. If you take another look at the animation in section 4.2, you’ll see why. When a player clicks to drop a new chip into the game frame, they won’t see it right away. The chip must be sent to the server, processed by the server’s physics engine, and broadcast back in a snapshot before the player gets to see it.</div>
        <div className="p">If a player has a fast internet connection and happens to live near the game server, they might not notice the delay. But if the player is on a slow network or lives halfway around the world, they may experience a round trip time of hundreds of milliseconds before seeing the result of their input.</div>

        {/* Latency by location table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Player Location</th>
                <th>Estimated RTT to Our Server in San Francisco</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Los Angeles</td>
                <td>20 ms</td>
              </tr>
              <tr>
                <td>New York</td>
                <td>130 ms</td>
              </tr>
              <tr>
                <td>London</td>
                <td>300 ms</td>
              </tr>
              <tr>
                <td>Moscow</td>
                <td>400 ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Citation
          contributingOrganization="Wonder Network"
          title="Global Ping Statistics"
          url="https://wondernetwork.com/pings"
        />

        <div className="p">Research shows that humans perceive response times of under 100-150ms as instantaneous, but that anything longer appears noticeably delayed.
          <Citation
            creator={'Sergey Ignatchenko'}
            creationDate={"July 7, 2017"}
            title={'Development and Deployment of Multiplayer Online Games, Vol 1'}
            publisher={'ITHare'}
          />
          This means some players will have a much better gaming experience than others.
        </div>

        <h5 id="4231-Solution-Is-There-One">Solution: ...Is There One?</h5>
        <div className="p">If we rely entirely on snapshots, there is no real solution for input lag. No matter what, new inputs must travel to the server and back again before clients can see them, not unlike in the earlier lockstep model.</div>
        <div className="p">Many games utilize clever animations or other sleight of hand to distract players from these delays. If you’ve ever tried to cast a spell and been treated to a long sequence of wand flourishes before you make your move, input lag is likely to blame.</div>
        <div className="p">If we want to avoid input lag entirely, we must find a way to predict the game state on the client <em>before</em> a snapshot is received. This means moving away from a pure snapshot implementation, which we’ll investigate next.</div>

        <h3 id="prediction">4.3 Predicting the Game State</h3>
        <div className="p">Before we jump into how we can predict the state of our game, let’s consider how game state prediction works in general.</div>
        <h4 id="Mental-Model">Mental Model</h4>
        <div className="p">Predicting game state from older state is a very common strategy many games use to create the illusion of a lag-free environment.</div>
        <div className="p">Imagine a traditional platforming game: if a player performs an action or moves their avatar, there is an expectation of instant visual feedback even though the server does not yet have knowledge of any inputs. The client-side avatar begins moving right away and will synchronize with the server as information becomes available. The term for this is <strong>client-side prediction</strong>:</div>
        <figure>
          <img src="https://s1.gifyu.com/images/mario-cs-prediction.gif" alt="Client side prediction" />
        </figure>
        <div className="p">Also, if another player temporarily loses connection, the other player clients can often correctly assume that the disconnected avatar will continue moving in the same direction. This represents what we call <strong>extrapolation</strong>:</div>
        <figure>
          <img src="https://s1.gifyu.com/images/mario-wifi.gif" alt="Extrapolation" />
        </figure>
        <div className="p"><em>Note: Client-side prediction and extrapolation are often conflated, but they are very similar in our game and can be handled the same way.</em></div>

        <h4 id="In-Our-Game">In Our Game</h4>
        <div className="p">For prediction to work, both the client <em>and</em> the server must have a game engine. We can take advantage of prediction in our game by introducing a client-side physics simulation, so that both server and client will simulate their worlds in tandem. In other words, we need both the clients and the server to be “smart.”</div>
        <figure>
          <img  className="small" src="https://i.imgur.com/Gg4xQfr.png" alt="Smart Clients and Server" />
        </figure>
        <div className="p">Running a physics engine on both the clients and the server allows us to:</div>
        <ul>
        <li>Instantly render new chips on the client before the server knows about them</li>
        <li>Extrapolate chip behaviour in between snapshots from the server</li>
        </ul><div className="p">Due to network latency, the client and server receive information about what is happening on the other “in the past,” which then needs to be reconciled. Let’s take a look at how the system works as a whole before focusing on the individual parts:</div>
      <figure>
          <img src="https://i.imgur.com/JVx8Ee4.png" alt="Extrapolation lifecycle" />
          <figcaption>Round-trip lifecycle of an input</figcaption>
        </figure>
        <div className="p">In the figure above, an input is made on frame <code>95</code>, but does not reach the server until frame <code>100</code>. However, both sides continue to simulate the game world during these 5 frames. Once the server receives the input, it needs to rewind the game <em>back</em> to frame <code>95</code> from frame <code>100</code>, and reenact what “actually” happened.</div>
        <div className="p">Once the reenactment is complete, it sends a snapshot of the entire game world at frame 100. Again, the game world continues forward while the snapshot is in transit.</div>
        <div className="p">Finally, on frame <code>105</code>, the client receives the snapshot reflecting the authoritative state at <code>100</code> and “regenerates” the game world based on it. It must now fast forward up to the current frame in order to reflect what it thinks the server must be seeing at frame <code>105</code>.</div>

        <h5 id="Detailed-Overview">Detailed Overview</h5>

        <div className="p">There is a fair amount of complexity hidden by the previous diagram, especially regarding the way reenactment operates on each side. What <em>actually</em> happens when an input is received by the server, or a snapshot is received by the client? Let’s take a look step-by-step:</div>
        <Slider {...sliderSettings}>
          <div>
            <img alt="Extrapolation Carousel 1" src="https://s15.postimg.cc/cwup2ewyj/image.png" />
            <div className="legend">The client and the server both start on the same frame, with no chips currently in play. In this example, we assume that the latency from client to server is 3 frames.</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 2" src="https://s15.postimg.cc/sic0mdgmj/image.png" />
            <div className="legend">(a) Client drops a chip, it appears instantly on their screen and begins dropping</div>
            <div className="legend">(b) At the same time, the client sends input message to the server for frame 1</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 3" src="https://s15.postimg.cc/jnb6bv79n/image.png" />
            <div className="legend">(b) Input in transit</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 4" src="https://s15.postimg.cc/q109f44fv/image.png" />
            <div className="legend">(b) Input in transit</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 5" src="https://s15.postimg.cc/y6ibdav9n/image.png" />
            <div className="legend">(b) Input in transit</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 6" src="https://s15.postimg.cc/h5zf4lv2z/image.png" />
              <div className="legend">(c) Server receives input after 3 frames</div>
              <div className="legend">(d) Server rewinds state to frame when the input was created, frame 1, and processes the input by creating a chip</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 7" src="https://s15.postimg.cc/mhebpbovf/image.png" />
            <div className="legend">(d) Server reenacts state up to current frame, frame 4</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 8" src="https://s15.postimg.cc/jnb6bvuez/image.png" />
            <div className="legend">(d) Server reenacts state up to current frame, frame 4</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 9" src="https://s15.postimg.cc/i89ln68rf/image.png" />
              <div className="legend">(e) Server reenactment as caught up to frame 4</div>
              <div className="legend">(f) Server generates snapshot and transmits it to the client</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 10" src="https://s15.postimg.cc/pr1xnaubf/image.png" />
            <div className="legend">(f) Snapshot in transit</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 11" src="https://s15.postimg.cc/nmhkm80ej/image.png" />
            <div className="legend">(f) Snapshot in transit</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 12" src="https://s15.postimg.cc/4hebcgtgb/image.png" />
            <div className="legend">(f) Snapshot in transit</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 13" src="https://s15.postimg.cc/nwfwe37yz/image.png" />
              <div className="legend">(g) Client receives snapshot on frame 7</div>
              <div className="legend">(h) Client regenerates state from the
                snapshot. This state is from frame 4, so the client must reenact
                 the simulation up to the current frame behind the scenes</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 14" src="https://s15.postimg.cc/olyoqh3dn/image.png" />
            <div className="legend">(h) Client steps simulation forward until it
                reaches the current frame</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 15" src="https://s15.postimg.cc/6vx05fi2z/image.png" />
            <div className="legend">(h) Client steps simulation forward until it
                reaches the current frame</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 16" src="https://s15.postimg.cc/6j5lz8kdn/image.png" />
            <div className="legend">(i) Simulation is caught up to current frame,
                so states are now synchronized; simulation can continue until
                the next snapshot</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 17" src="https://s15.postimg.cc/vcf5zwb3v/image.png" />
            <div className="legend">(j) Client and server continue simulation</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 18" src="https://s15.postimg.cc/fqxufymaz/image.png" />
            <div className="legend">(j) Client and server continue simulation</div>
          </div>
          <div>
            <img alt="Extrapolation Carousel 19" src="https://s15.postimg.cc/sic0mh3sr/image.png" />
            <div className="legend">(j) Client and server continue simulation</div>
          </div>
        </Slider>

        <h4 id="431-Client-Side-Reenactment">4.3.1 Client-Side Reenactment</h4>
        <div className="p">Without extrapolation, the client side is constantly receiving snapshots of the entire game state, buffering the snapshots and displaying them as soon as possible. Our approach changes when we begin extrapolating, because the client’s simulation is always ahead of the snapshot it just received.</div>
        <div className="p">To account for this, the reenactment process on the client consists of two major components:</div>
        <ol>
          <li>Regeneration from the snapshot</li>
          <li>Fast forward to the current frame</li>
        </ol>
        <div className="p">We can begin with an overview of the pseudocode executed during each frame. The gist is that if a snapshot exists, we perform regeneration and fast forward; otherwise, update the simulation as we normally would locally. Only the latest snapshot is used when regenerating; we do not buffer older snapshots as before since they are immediately stale. Here's the pseudocode:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {animateClientReenactment}
        </SyntaxHighlighter>

        <h5 id="1-Regenerate-from-Snapshot">1. Regenerate from Snapshot</h5>
        <div className="p">Regenerating from a snapshot entails two things: Updating the physical properties of chips which currently exist in the world, and creating chips which do not yet exist. If a chip in the snapshot does not exist in our world, it means that it is a newly dropped chip, so we must create and add it to the simulation and renderer.</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {regenerateFromSnapshot}
        </SyntaxHighlighter>

        <h5 id="2-Fast-Forward-to-Present">2. Fast Forward to Present</h5>
        <div className="p">Fast forwarding to the current frame is simple: we simply move the engine forward one step for every frame that the snapshot is behind. It is important to note that this process happens in the background, as we do not want the renderer to be affected by the reenactment.</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {catchUpToCurrentFrameFrom}
        </SyntaxHighlighter>

        <h4 id="432-Server-Side-Reenactment">4.3.2 Server-Side Reenactment</h4>
        <div className="p">While clients are receiving a stream of snapshots, the server is enduring a constant wave of inputs from each client. Because each of these inputs are describing the past, the server must also perform a reenactment to settle on a state that includes the recent inputs.</div>

        <h5 id="Useful-Data-structures">Useful Data structures</h5>
        <div className="p">Before we cover the implementation details of server-side reenactment, there are a few very useful data structures we can use to help: A <strong>snapshot history</strong> to keep track of all frames generated, an <strong>input history</strong> to keep track of all input events, and an <strong>input buffer</strong> to optimize how often we perform reenactments.</div>

        <Aside emphasized={true}>
          <h6 id="Snapshot-History">Snapshot History</h6>
          <div className="p">Our server must keep a snapshot history of every single frame it has already simulated, and be able to recall it when a new input is received. As the only constraints here are a constant <code>O(1)</code> read time and delete time, we use a regular JavaScript object for our history with frames as keys and snapshots as values. This way, we can access a historical frame and rewind to it in one step.</div>

          <h6 id="Input-History">Input History</h6>
          <div className="p">But once we have rewound to a past frame, what happens to those inputs that occured between then and the current frame? It’s clear that we need to have an input history as well. Again, we used a JavaScript object for its <code>O(1)</code> read time; this time the value is the input itself (or an array of inputs), so as we fast-forward through each frame, we can check if an input exists in constant time, and process it if so.</div>

          <h6 id="Input-Buffer">Input Buffer</h6>
          <div className="p">If we processed every input as it came in, the server would end up reenacting a lot more often than necessary. In the worst case scenario, every player might input a chip at the same frame, and we would reenact multiple times to produce a <em>single</em> snapshot.</div>
          <div className="p">To resolve this, we want to package inputs from the same frame together. Instead of processing every single input as it comes in, we use a buffer to temporarily store the inputs and process them all into the input history before a reenactment.</div>
          <div className="p">We implement this buffer using a linked list. This is because we consume the buffer from the head and linked lists provide an <code>O(1)</code> constant time shift operation. By maintaining a reference to the last input in the buffer, we also have <code>O(1)</code> insertion into the queue.</div>
        </Aside>

        <h6 id="Implementation">Implementation</h6>
        <div className="p">Our high-level implementation is fairly straightforward:</div>
        <ul>
          <li>If there are inputs in the buffer:
          <ul>
            <li>Process them by adding them to the input history</li>
            <li>Rewind to state at the earliest input’s frame</li>
            <li>Reenact up to the current frame</li>
          </ul>
        </li>
          <li>Update the simulation, whether there was reenactment or not</li>
        </ul>
        <div className="p">Here's the pseudocode for our <code>animate</code> function on the server side:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {implementationSnippet}
        </SyntaxHighlighter>

        <h4 id="Restoring-World-from-a-Snapshot">Restoring World from a Snapshot</h4>
        <div className="p">To rewind the state to a previous snapshot, there are 3 categories of chips we need to handle, those which:</div>
        <ol>
          <li>Do not exist on the client, but exist in the snapshot</li>
          <li>Exist on the client <em>and</em> in the snapshot</li>
          <li>Exist on the client but not in the snapshot</li>
        </ol>
        <div className="p">So our rewind step consists of iterating over the chips in the snapshot, creating chips that fall into (1) and updating chips that fall into (2).</div>
        <div className="p">Chips in (3) result from the fact that we are going “back in time,” and the client world may contain new chips that are not present in the past. So after iterating over the snapshot, we remove any chips that fall into (3).</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {restoreWorldFromSnapshot}
        </SyntaxHighlighter>

        <h4 id="Reenactment">Reenactment</h4>
        <div className="p">Server-side reenactment is reminiscent of the client-side fast forward, except we have a history of the every input made along the way. Because the rewind step removed chips which have been created since that frame, we must recreate those inputs by referencing the input history at every step.</div>
        <div className="p">Also, because we need to retain a full history of every frame simulated, we need to update that history as we reenact frames, as that canonical history has been altered.</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {catchUpToCurrentFrameFromServerSide}
        </SyntaxHighlighter>

        <h4 id="434-Client-Side-State-Divergence">4.3.4 Client-Side State Divergence</h4>
        <div className="p">One topic we have not yet discussed is what happens when state diverges. With a pure snapshot approach, all clients are consistent with the server at every point in time. Now that there is a local client-side simulation, we might find that there is a disagreement between where the client <em>thinks</em> a chip is, and where the reenactment indicates that it <em>“really”</em> is. In some cases, it is acceptable to simply “snap” to the new state, but there are some strategies to help smooth out the discrepancies more naturally.</div>

        <h5 id="Popping">Popping</h5>
        <div className="p">When the client performs a reenactment and discovers that the current and the reenacted chip positions have diverged, it can simply render the new position and continue simulating. This can result in a “popping” effect, where the chip pops out of existence at one point, and back into existence elsewhere:</div>
        <Slider {...sliderSettings}>
          <div>
            <img alt="Popping Carousel 1" className="small" src="https://s15.postimg.cc/681xrs83v/image.png"/ >
            <div className="legend">(a) The simulation has only one chip, currently
              simulating frame 50</div>
          </div>
          <div>
            <img alt="Popping Carousel 2" className="small" src="https://s15.postimg.cc/681xrsftn/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 3" className="small" src="https://s15.postimg.cc/x5vutj86j/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 4" className="small" src="https://s15.postimg.cc/izg3yb517/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 5" className="small" src="https://s15.postimg.cc/ppwl7r7mj/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 6" className="small" src="https://s15.postimg.cc/q2nzdxi6j/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 7" className="small" src="https://s15.postimg.cc/b6pg6ctx7/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 8" className="small" src="https://s15.postimg.cc/pd571kx2j/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 9" className="small" src="https://s15.postimg.cc/edjzpzm2z/image.png"/ >
            <div className="legend">(b) On frame 57, a snapshot is received with
              the game state on frame 53, so we must reenact until the current
              frame</div>
          </div>
          <div>
            <img alt="Popping Carousel 10" className="small" src="https://s15.postimg.cc/esv9j30bf/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 11" className="small" src="https://s15.postimg.cc/wt4gnev2j/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 12" className="small" src="https://s15.postimg.cc/cyif1a0ff/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 13" className="small" src="https://s15.postimg.cc/eqbdw6ri3/image.png"/ >
            <div className="legend">(c) Simulation has caught up to the current
              frame, but the state is divergent; the chip is not where we
              thought.</div>
          </div>
          <div>
            <img alt="Popping Carousel 14" className="small" src="https://s15.postimg.cc/nb4pnfm9n/image.png"/ >
            <div className="legend">(d) The position will immediately snap to the
              new position, as if the chip popped in and out of existence</div>
          </div>
          <div>
            <img alt="Popping Carousel 15" className="small" src="https://s15.postimg.cc/coawi06ej/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 16" className="small" src="https://s15.postimg.cc/9u7r4krdn/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 17" className="small" src="https://s15.postimg.cc/oq6ac5v2j/image.png"/ >
          </div>
          <div>
            <img alt="Popping Carousel 18" className="small" src="https://s15.postimg.cc/a6z5arhd7/image.png"/ >
            <div className="legend">(e) Final path, showing the unnatural path
              when including popping</div>
          </div>

        </Slider>
        <div className="p">While this works perfectly fine when divergence is not severe, if the positions are dozens of pixels apart, the effect can be jarring and chips can appear to teleport. One of the most important aspects of a physics-based game is for objects to have a natural path that your eyes can follow. This creates the important illusion of continuity so that the viewer can register an object to persist between frames as the same object. If we let chips pop, we will be sacrificing an important aspect of the player experience.</div>

        <h5 id="Solution-Bending">Solution: Bending</h5>
        <div className="p">The best way to handle the problem of continuity with respect to state divergence is to perform bending (or smoothing). This means that once a new position is calculated, we don’t render it immediately, but instead continue rendering our <em>old</em> position. Then, over a period of 3-5 frames, we can “push” the old position towards the new one.</div>
        <Slider {...sliderSettings}>
          <div>
            <img alt="Bending Carousel 1" className="small" src="https://s15.postimg.cc/681xrs83v/image.png" />
            <div className="legend">(a) We start on frame 50 with a single chip on
               the client side simulation</div>
          </div>
          <div>
            <img alt="Bending Carousel 2" className="small" src="https://s15.postimg.cc/681xrsftn/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 3" className="small" src="https://s15.postimg.cc/x5vutj86j/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 4" className="small" src="https://s15.postimg.cc/izg3yb517/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 5" className="small" src="https://s15.postimg.cc/ppwl7r7mj/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 6" className="small" src="https://s15.postimg.cc/q2nzdxi6j/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 7" className="small" src="https://s15.postimg.cc/b6pg6ctx7/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 8" className="small" src="https://s15.postimg.cc/pd571kx2j/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 9" className="small" src="https://s15.postimg.cc/edjzpzm2z/image.png" />
            <div className="legend">(b) On frame 57, we receive a snapshot of the
              world at frame 53</div>
          </div>
          <div>
            <img alt="Bending Carousel 10" className="small" src="https://s15.postimg.cc/5vajlnna3/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 11" className="small" src="https://s15.postimg.cc/wt4gnev2j/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 12" className="small" src="https://s15.postimg.cc/cyif1a0ff/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 13" className="small" src="https://s15.postimg.cc/eqbdw6ri3/image.png" />
            <div className="legend">(c) The simulation has caught up to the
              current frame, but the state has diverged.</div>
          </div>
          <div>
            <img alt="Bending Carousel 14" className="small" src="https://s15.postimg.cc/3qq6klo8b/image.png" />
            <div className="legend">(d) Instead of snapping the chip immediately
              to the new position, we render the old position and calculate
              the distance between the old and the new position. Over the
              course of the next few frames, we will minimize this distance,
              pulling the old position towards the actual position.</div>
          </div>
          <div>
            <img alt="Bending Carousel 15" className="small" src="https://s15.postimg.cc/c8zmoxn17/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 16" className="small" src="https://s15.postimg.cc/8pdoz57gr/image.png" />
          </div>
          <div>
            <img alt="Bending Carousel 17" className="small" src="https://s15.postimg.cc/db9t7hla3/image.png" />
            <div className="legend">(e) The rendered position now matches the
              actual, simulated position</div>
          </div>
          <div>
            <img alt="Bending Carousel 18" className="small" src="https://s15.postimg.cc/tz1b9zvh7/image.png" />
            <div className="legend">(e) The final path utilizing bending. Notice
            that the path is more continuous and natural, but there is an
            unfortunate side effect that the chip appears to have gone through
            a peg.</div>
          </div>
        </Slider>

        <div className="p">The result is a smooth path which the eye can follow naturally, but the path may still appear to be “impossible” based on the physics.</div>

        <h6 id="Bending-Implementation">Bending Implementation</h6>
        <div className="p">We can implement bending by snapping the physics to the new position immediately, while slowly updating the rendered position over the course of multiple frames. In the pseudocode below, we first calculate the distance between the new and old object, then we render the old position plus some percentage of the distance:</div>

        <SyntaxHighlighter {...syntaxHighlighterProps}>
          {bendingImplementation}
        </SyntaxHighlighter>

        <h4 id="435-Tradeoffs">4.3.5 Tradeoffs</h4>
        <div className="p">Compared to relying solely on snapshots, prediction provides two major benefits:</div>
        <ul>
          <li><strong>Lower Bandwidth:</strong> Snapshots can be transmitted as infrequently as 5-10 times per second because a client-side simulation is so effective at estimating what occurs between snapshots.</li>
          <li><strong>Instant Feedback:</strong> The client gets instant visual feedback when an input is made because it can render that input before any snapshot reflecting the input is received.</li>
        </ul>
        <div className="p">In exchange for these benefits, there are some drawbacks:</div>
        <ul>
          <li><strong>Lag Compensation:</strong> Every communication must compensate for the latency between the client and server. While both client and server simulate in the “present,” all inputs and snapshots come from the “past.” Thus, the world must constantly be rewound and reenacted to maintain a real-time experience.</li>
          <li><strong>More Computationally Intensive:</strong> Both the client and the server need to do considerably more work per frame. If one user experiences a high CPU load or has a slower computer, the computations necessary for reenactment might exceed the number of milliseconds available per frame. If this is the case, there may be a need to lower that client’s frame rate (along with raising his or her physics timestep) in order to extend this computation budget. Likewise, if the reenactment strain is too high on the server, the server would need to lower its own frame rate as well as every client’s.</li>
        </ul>

        <h4 id="436-Estimating-Latency">4.3.6 Estimating Latency</h4>
        <div className="p">There’s one last thing we need to address. Our game implicitly expects that the clients and server are running on the same timeline. This means that if the server is on frame 100, we expect any given client to be within a few frames of that when sending or receiving inputs. If this is not the case, our game will break down because our game engine will be forced to reenact too far into the past. So how do we ensure that clients and the server start the game in a synchronized manner and maintain a unified timeline?</div>
        <div className="p">We need to estimate the average latency between a given client and the server. We use the term "estimate" because there is no sure-fire of knowing the exact latency between the client and server. No two clocks will ever agree on exactly what the current time is, and no two transmissions over the internet are guaranteed to take the exact amount of time. But by utilizing the algorithm described below, we are able to get a latency estimate that’s sufficient for our purposes.
          <Citation
            creator={'Zachary Booth Simpson'}
            creationDate={"March 01, 2000"}
            title={'A Stream-based Time Synchronization Technique For Networked Computer Games'}
            url={"http://www.mine-control.com/zack/timesync/timesync.html"}
          />
        </div>

        <Slider {...sliderSettings}>
          <div>
            <img alt="Latency Estimation Carousel 1" className="medium" src="https://s15.postimg.cc/jbtpyydx7/latency_step2.png" />
            <div className="legend">Step 1: The client stamps its current local time on a “time request” packet and sends to the server as a ping</div>
          </div>
          <div>
            <img alt="Latency Estimation Carousel 2" className="medium" src="https://s15.postimg.cc/3qcef0p4b/latency_step3.png" />
            <div className="legend">Step 2: When the server receives the packet, the server stamps its own local time time and sends a pong back to the client</div>
          </div>
          <div>
            <img alt="Latency Estimation Carousel 3" className="medium" src="https://s15.postimg.cc/atk9ummu3/latency_step4.png" />
            <div className="legend">Step 3: When the server receives the packet, the client subtracts its current local time from its sent time and divides by two to compute latency. It also subtracts its current time from server time to determine client-server time difference and adds in the half-latency to get the correct difference in clock times.</div>
          </div>
          <div>
            <img alt="Latency Estimation Carousel 4" className="medium" src="https://s15.postimg.cc/67o5m8r0b/latency_step5.png" />
            <div className="legend">Step 4: The client repeats the previous steps 10 times and adds the results to a latency history</div>
          </div>
          <div>
            <img alt="Latency Estimation Carousel 5" className="medium" src="https://s15.postimg.cc/8ozwtiy23/latency_step6b.png" />
            <div className="legend">Step 5: The latency history is sorted lowest to highest</div>
          </div>
          <div>
            <img alt="Latency Estimation Carousel 6" className="medium" src="https://s15.postimg.cc/n871uxbrf/latency_step7b.png" />
            <div className="legend">Step 6: The median latency is taken. All samples above or below 1 standard deviation of the median are discarded</div>
          </div>
          <div>
            <img alt="Latency Estimation Carousel 7" className="medium" src="https://s15.postimg.cc/t94qs063f/latency_step8b.png" />
            <div className="legend">Step 7: The remaining samples are averaged, giving us our average latency.</div>
          </div>
        </Slider>

        <div className="p">Now that we have a reliable means of estimating latency before the game starts, each client can use this information to predict what frame of the simulation the server is on.</div>

        <h4 id="437-Conclusion">4.3.7 Conclusion</h4>
        <div className="p">While prediction adds significant complexity to our implementation, it allows us to reduce our bandwidth needs considerably and creates a better experience for the user.</div>

        {/* Finished Product */}

        <h2 id="finished-game">5 Finished Game</h2>
        <div className="p">In the end, we’ve built a real-time, multiplayer, physics-based game using only JavaScript and the basic features of a browser. Our clients and authoritative server communicate over WebSockets, and we employ snapshots and extrapolation to synchronize game state across nodes. To optimize bandwidth, we compress network data using quantization and binary serialization. Our game lobby and player matchmaking system is built with React.</div>

        <figure>
          <img className="medium" src="https://media.giphy.com/media/7OXlwbUUS9ckxYDIl7/giphy.gif" alt="Plinko Gameplay" />
          <figcaption>Recorded gameplay and React lobby system</figcaption>
        </figure>

        <div className="p">Find our finished implementation on <a href="https://github.com/plinko-team/plinko" target="_blank" rel="noopener noreferrer">GitHub</a>. Or play the game yourself <a href="/play">here</a>!</div>

        {/* Future Work */}

        <h2 id="future-work">6 Future Work</h2>

        <h3 id="61-Support-More-Players">6.1 Support More Players</h3>
        <div className="p">Our game currently supports up to four active players at a time. This forced us to create a complex lobby system to queue up waiting players and move them into the game when their turn comes, but this is not an ideal solution. In the future, we would like to scale the game to support multiple simultaneous groups of players in separate rooms.</div>

        <h3 id="62-A-Pure-WebSocket-Implementation">6.2 A Pure WebSocket Implementation</h3>
        <div className="p">We use Socket.io as a wrapper for the WebSocket protocol and the associated WebSockets API. Socket.io serves us well, but it also provides extraneous functionality we don’t need, while adding some extra overhead to our messages. We can cut out this data overhead by forgoing a library and interfacing directly with WebSockets.</div>

        <h2 id="about-us">About the Team</h2>
        <div className="p">Our team of three web developers built Plinko remotely, working together from across North America. We pair-programmed, bug-squashed, and drank 3,425,718 cups of coffee.</div>

        <ul className="team">
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


        <div className="p">Please feel free to get in touch if you’d like to talk software engineering, games, or the web. We’re always open to learning about new opportunities.</div>

        {/* Further Reading */}

        <h2 id="further-reading">Further Reading</h2>
        <div className="p">If you’re interested in networked gaming, we recommend checking out the resources below, all of which were invaluable to our research.</div>
        <ul>
          <li><a href="https://gafferongames.com/" target="_blank" rel="noopener noreferrer">Gaffer On Games</a></li>
          <li><a href="https://www.koonsolo.com/news/dewitters-gameloop/" target="_blank" rel="noopener noreferrer">deWITTER’s Game Loop</a></li>
          <li><a href="http://ithare.com/contents-of-development-and-deployment-of-massively-multiplayer-games-from-social-games-to-mmofps-with-stock-exchanges-in-between/" target="_blank" rel="noopener noreferrer">Development and Deployment of Multiplayer Online Games</a></li>
        </ul>
      </div>
    </main>
  )
}

export default About;
