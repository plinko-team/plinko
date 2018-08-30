import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

import Citation from './Citation';
import Aside from './Aside';

const About = () => {

  return (
    <main>
      <div className="main-content">
        <h1 id="test">Sample H1 (e.g. Case Study)</h1>
        <p>Paragraph for reference</p>
        <h2>Sample H2 (e.g. 4 Synchronizing Networked Game State)</h2>
        <p>Paragraph for reference</p>
        <h3>Sample H3 (e.g. 4.2 Transmitting the Entire Game State)</h3>
        <p>Paragraph for reference</p>
        <h4>Sample H4 (e.g. 4.2.1 Network Jitter)</h4>
        <p>Paragraph for reference</p>
        <h5>Sample H5 (e.g. Solution: Snapshot Buffer)</h5>
        <p>Paragraph for reference</p>
        <h6>Sample H6 (e.g. Implementation)</h6>
        <p>Paragraph for reference</p>

        <hr></hr>

        <Aside>
          <p>This is a sample Aside component, which may hold any child elements.</p>
          <p>Set its styles by selecting <code>aside</code>, or the wired-cards styles by selecting <code>.aside-container wired-card</code> in index.css.</p>
        </Aside>
        <p>Sample paragraph between two Asides</p>
        <Aside emphasized={true}>
          <p>This is an emphasized Aside component. Pass <code>true</code> to the prop <code>emphasized</code>.</p>
          <p>Style the aside itself using <code>.emphasized aside</code>, or the wired-card using <code>.emphasized wired-card</code>. Note that background colors must be set directly on the wired-card.</p>
        </Aside>

        <Carousel swipeable={true} emulateTouch={true} transitionTime={0} showThumbs={false} infiniteLoop={true} showStatus={false}>
            <div>
                <img src="https://i.imgur.com/is6kNv7.png" />
                <p className="legend">Legend 1</p>
            </div>
            <div>
                <img src="https://i.imgur.com/is6kNv7.png" />
                <p className="legend">Legend 1</p>
            </div>
        </Carousel>

        <br></br>
        <p>Citation will go somehere at the end of this sentence probably
          <Citation
            creator={'Josh Nelson'}
            creationDate={"December xx, xxxx"}
            title={'A book by Josh'}
            contributingOrganization={'Myself'}
            url={"www.theotherjosh.com"}
            comment={'I guess comment goes here'}
          />
        </p>

        <p>Another example except some citations info is missing.
          <Citation
            creator={'Josh Nelson'}
            title={'A book by Josh'}
            contributingOrganization={'Myself'}
            url={"www.theotherjosh.com"}
          />
          Here is another sentence that happens to come after a citation.
        </p>

        {/* ACTUAL WRITEUP */}

        <h1>Case Study</h1>

        {/* Introduction */}
        <h2 id="1-Introduction">1 Introduction</h2>
        <p>Plinko.js is a real-time, multiplayer, networked physics game that can be
           played in the browser with no special plugins. We built the game and game
           management with JavaScript, using Node and React, with clients and
           server communicating over WebSockets.
        </p>
        <p>The major challenges we faced were synchronizing game state over the
          internet between multiple clients in real time, while facilitating
          live-action gameplay – all while relying only on the basic features
          of a browser. We crafted the game state synchronization architecture
          and algorithms from scratch, using no client-side plugins.
        </p>
        <p>Here, we'll explore how we built a browser-based game,
          strategies to synchronize game state in real time, and our final
          networked implementation. We’ll also discuss optimizations we leveraged,
          including protocol strategies, binary serialization, and latency
          estimation.
        </p>
        <figure>
          <img src="https://media.giphy.com/media/piFH1TwJYvfB4vEX6q/giphy.gif" alt="Plinko Gameplay" />
          <figcaption>Actual recorded gameplay</figcaption>
        </figure>

        <h3 id="12-Design-Goals">1.2 Design Goals</h3>
        <p>Gameplay is similar to real-life Plinko, but with a twist.</p>
        <p>Up to four players may click to drop chips into the top of the game frame
           at the same time, and the goal is to hit as many pegs as you can to change
           them to your own color. The first player to activate enough pegs to hit
           the target score wins. The target score is a percentage of the total
           number of pegs – it starts at 100%, and it drops as the game progresses.
           If you’re playing alone, the game becomes a race against the clock.
        </p>
        <p>Since gameplay requires multiple players to drop as many chips as possible
           as quickly as they can, we know we need to handle a lot of traffic and a
            fast-moving game state. We must:
        </p>
        <ul>
          <li>Maintain real-time gameplay between multiple players and the illusion
              of a lag-free environment with latencies as high as 100-200ms
          </li>
          <li>Optimize bandwidth and throughput to support a wide variety of possible
              connection speeds
          </li>
          <li>Manage a constantly changing divergent game-state</li>
        </ul>

        {/* Building a Browser Game */}

        <h2 id="2-Building-a-Browser-Game">2 Building a Browser Game</h2>
        <p>Our first task is to create a single-player version of our real-time game that runs in a user’s local browser, using no special plugins or game networking frameworks.</p>
        <p>To start, any game must take three basic steps:</p>
        <ol>
          <li>Accept player inputs</li>
          <li>Use those inputs to simulate a game world</li>
          <li>Show the updated game world to the player</li>
        </ol>
        <p>In our game, players make inputs by clicking inside the game frame. A click creates a new chip, which will make its way through the pegs toward the bottom of the frame. That’s step one.</p>
        <p>But how exactly does the chip <em>make its way</em>? In a physics-based game like ours, a physics engine is responsible for simulating the game world. We use Matter.js, a 2D rigid body physics engine written in JavaScript. Matter provides simulated gravity, friction, and other forces for our new chip to interact with. It lets us calculate, given certain conditions, where any chip should be at any moment in time. That’s step two.</p>
        <p>Finally, it’s not enough for our app to know what’s happening to a chip. We have to actually show it to the player! Existing rendering libraries have limitations for our game and/or excess functionality that would slow us down, so we decided to write our own renderer using HTML5 Canvas and Rough.js, a graphics library with a hand-sketched feel. The Canvas API lets us connect the calculations of our physics engine directly to the browser’s drawable canvas element. That’s step three, and we’re in business… almost.</p>


        <h3 id="21-Game-Loops">2.1 Game Loops</h3>
        <p>Our game can’t just take the three game steps once and call it a day. If we want it to run in real time, it must take those steps continuously.</p>

        <h4 id="211-Looping-Physics">2.1.1 Looping Physics</h4>
        <p>In real life, physics is continuous by nature. Imagine dropping a real plastic chip into a real frame full of wooden pegs. How many positions in space will that chip occupy on its way down? The answer isn’t quantifiable – the chip will exist at an incalculable number of points between the top of the frame and the bottom.</p>
        <p>A physics simulation needs to model this behavior, but we can’t ask it to calculate incalculable data. Instead, it needs to calculate the position of the chip at a discrete moment in time, then at a moment a little while after, then one a little after that. When we see these positions all in row, we get the illusion of continuous movement.</p>

        <figure>
          <img src="https://i.imgur.com/QnL9rtT.png" alt="Simulated Chip Positions" />
          <figcaption>Figure 2.1.1: A single chip’s positions at discrete points in time</figcaption>
        </figure>

        <p>Here’s one simple idea:</p>

        {/* While loop snippet goes here */}

        <p><code>while</code> loops run repeatedly, as fast as the computer’s processor can manage. This means we have a problem right away: the game will run more slowly on a slow computer than on a fast one. Instead, we need some way to get consistent performance for any machine. That means moving the simulation forward at the same speed for any user, regardless of processing power. We can achieve this with a <strong>fixed timestep</strong>.</p>

        <h4 id="212-Timesteps">2.1.2 Timesteps</h4>
        <p>A timestep provides specific instructions for the physics engine. It’s the amount of time that the engine should move the world forward in each step. It’s essential that the timestep be fixed, which means the exact same length of time is simulated in every loop. Unlike the <code>while</code> loop, a fixed timestep:</p>
        <ul>
          <li>Is deterministic for the same user in the same browser</li>
          <li>Allows us to decouple rendering graphics from simulating the game</li>
        </ul>

        <p>We want to display our game at 60 frames per second to provide a smooth, realistic visual experience for players
          <Citation
            creator={'Samit Sarkar'}
            creationDate={"June 05, 2014"}
            title={'Why frame rate and resolution matter: A graphic primer'}
            contributingOrganization={'Polygon'}
            url={"https://www.polygon.com/2014/6/5/5761780/frame-rate-resolution-graphics-primer-ps4-xbox-one"}
          />
          . To achieve this, we’ll advance the physics simulation at a fixed rate of 16.67 milliseconds in each frame (1000 milliseconds / 60 fps).
        </p>

        <h4 id="213-Frame-Rate-Independence">2.1.3 Frame Rate Independence</h4>
        <p>Currently, our physics engine steps forward and the game is rendered on every single frame. A loop that renders and updates the simulation at the same time can work well as long as conditions are ideal, but a user with a particularly fast processor will experience a faster moving physics simulation. Likewise, a slower computer will result in a sluggish physical environment.</p>
        <p>Let’s consider an example where, due to heavy computational load, it takes 100ms of real time to run a single step of our game loop. Essentially, 100ms have passed in the real world, but the physics simulation has only moved forward 16ms. In 100ms, we would expect six frames to be simulated and rendered, but instead our game only generates one. If this happens multiple times in a row, the frame rate will drop and the game world will actually appear to <em>slow down</em>.</p>
        <p>Even if our display frame rate is lowered, we still need the physics engine to simulate 100ms when 100ms have elapsed. Otherwise, the motion on the screen will be  and jittery; the speed of a chip should only depend on its physical properties, not the speed of the computer running it.
          <Citation
            creator={'Koen Witters'}
            creationDate={"July 13, 2009"}
            title={'deWiTTERS Game Loop'}
            url={"https://www.koonsolo.com/news/dewitters-gameloop/"}
          />
        </p>
        <p>The solution is to decouple the renderer from the physics engine. This entails keeping track of how much time has elapsed since the previous game loop, and, if necessary, stepping the simulation forward multiple times before rendering the next frame.</p>

        <h4 id="213-requestAnimationFrame">2.1.3 <code>requestAnimationFrame</code></h4>
        <p>Now that we have our game loop goals in mind, your first instinct might be to implement the loop using <code>setInterval</code> or <code>setTimeout</code>. But remember that we need to run our game on a fixed timestep, and neither of these methods are guaranteed to execute the callback at the exact delay time we pass in. Instead, this delay will be the <em>minimum</em> amount of time it takes for the callback to be executed. Actual execution time will depend on how many other tasks are also waiting in the queue 
          <Citation
            title={'Concurrency model and Event Loop'}
            contributingOrganization={'Mozilla Developor Network'}
            url={"https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#Zero_delays"}
            comment={'Do we want to include a comment here?'}
          />
          .
        </p>
        <p>Inexact callback timing isn’t only detrimental to our fixed timestep – it will also cause rendering problems in the browser. Browsers typically repaint pages every 16.67ms, and if our almost-but-not-exactly-16.67ms game loop gets out of sync with the repaint schedule, players may experience skipped frames and other unpleasant visual artifacts. If we run our loop more often than every 16.67ms to account for this, we end up trying to render more frequently than the browser is able to repaint, creating unnecessary computation.</p>
        <p>Luckily, there’s a better option. <code>requestAnimationFrame</code> is a JavaScript browser method on <code>window</code> that’s optimized for looping animation. It lets us pass in a callback, which will be executed before the browser’s next repaint. We’ll pass in the function we use to increment our game engine, and we’ll create a loop by calling <code>requestAnimationFrame</code> recursively inside the callback. Here’s a simplified look at our new looping architecture:</p>

        {/* GameLoop snippet goes here */}

        <p>Now we’re controlling <em>what</em> to animate – our updated world – but letting the browser handle <em>when</em> to animate, which will occur at its natural 60fps repaint rate. The result is a smoother visual experience for players. You can see the difference in the animations below, which contrast <code>requestAnimationFrame</code> with a loop created using <code>setTimeout</code>:</p>

        <figure>
          <img src="https://s1.gifyu.com/images/ezgif-4-25e4c4895b.gif" alt="requestAnimationFrame" />
          vs.
          <img src="https://s1.gifyu.com/images/ezgif-4-364b79fa2d.gif" alt="setTimeout" />
          <figcaption><code>requestAnimationFrame</code> renders at a smooth 60fps, while <code>setTimeout</code> creates an unpredictable frame rate</figcaption>
        </figure>

        <p><code>requestAnimationFrame</code> also provides other optimizations, like pausing animation when a tab is out of focus to conserve player CPU resources and battery life.</p>

        <h4 id="214-Putting-It-All-Together">2.1.4 Putting It All Together</h4>
        <p>By now, we know our game loop must make use of a few key strategies:</p>
        <ul>
          <li>A fixed timestep</li>
          <li><code>requestAnimationFrame</code></li>
          <li>Frame rate independence</li>
        </ul>
        <p>We’ll also introduce one final idea: now that we’ve decoupled our physics simulation from our renderer, it’s possible that we’ll be ready to render a new frame when the physics engine is still somewhere in between two steps. If this is the case, we need to <strong>interpolate</strong> between these steps – in other words, ask the physics engine to calculate the game world <em>in between</em> the two steps, at the moment in time we’d like to render.</p>
        <p>You can see how this works in the pseudocode for our final game loop implementation:</p>

        {/* GameLoop snippet 2.1.4 goes here */}

        <ul>
          <li>We track <code>elapsedTime</code> to capture how long the previous loop took</li>
          <li>If <code>elapsedTime</code> is too big (a processing spike occurred), we cap it with <code>MAX_ELAPSED_TIME</code> so that we don’t simulate too much time</li>
          <li><code>accumulatedTime</code> is how we track how much time has passed since the last physics simulation.</li>
          <li>If <code>accumulatedTime</code> is greater than <code>TIMESTEP</code> we know that enough time has passed to advance the simulation forward</li>
          <li>Knowing our <code>alpha</code>, how far we are between simulations, allows us to  interpolate between simulation points</li>
        </ul>

        {/* Network Architecture */}

        <h2 id="3-Network-Architecture">3 Network Architecture</h2>
        <p>We’ve built a fully-functioning local physics game for a single player, but that’s only the first step. We want to let multiple users play together in the same game world, which means we need to network our game.</p>

        <h3 id="31-Client-Server-Architecture">3.1 Client-Server Architecture</h3>
        <p>We’ll use a client-server networking model where all players connect to a central server that acts as the authority on the game state (in contrast to peer-to-peer networking, where players connect to one another and there is no central authority).</p>
        <figure>
          <img src="https://i.imgur.com/is6kNv7.png" alt="Client-Server architecture" />
          <figcaption>Figure 3.1.1: Client-Server Architecture</figcaption>
        </figure>
        <p>Connected players, the clients, transmit inputs to the server. The server, in turn, sends the necessary game state information to all connected clients so that they can recreate the game state locally.</p>
        <p>Client-server architecture is the gold standard 
          <Citation
            creator={'Gabriel Gambetta'}
            title={'Fast-Paced Multiplayer (Part I): Client-Server Game Architecture'}
            url={"http://www.gabrielgambetta.com/client-server-game-architecture.html"}
          /> | 
          <Citation
            creator={'Sergey Ignatchenko'}
            creationDate={"July 7, 2017"}
            title={'Development and Deployment of Multiplayer Online Games, Vol 1'}
          />
          in multiplayer gaming thanks to a few chief benefits:
        </p>
        
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
        <p>There are some tradeoffs to this approach. For one, we have to provide and maintain the servers, and scale them if we want our game to grow. Network communication can also be slower than for peer-to-peer connections: instead of communicating directly with one another, data from one client to another must route through the server first.</p>
        <p>Still, the advantages mentioned above are significant, and the pros typically outweigh the cons when it comes to gaming.</p>

        <h3 id="32-WebSockets">3.2 WebSockets</h3>
        <p>Now that we have our network in place, how will we facilitate communication between our server and clients? We want to run our game at 60 frames per second, which requires transmitting large amounts of data between client and server very quickly.</p>
        <p>HTTP is an obvious protocol choice for most apps, but it isn’t well suited to our needs. It operates on a request-response cycle, and it must open and close a new connection for each new cycle. When we’re sending messages 60 times a second, this constant opening and closing will slow us down.</p>
        <p>WebSockets is built on TCP just like HTTP, but it provides stateful, bidirectional, full-duplex communication between client and server. Either the client or server may initiate communication, and both may send messages to one another simultaneously – all over a single connection that remains open for the lifetime of the communication session. After an initial HTTP handshake to open the connection, the client and server may exchange only the relevant application data with no headers, which decreases message overhead.</p>
        <p>These optimizations make it faster, and therefore a better choice for our game 
        <Citation
          creator={'David Luecke'}
          creationDate={"January 26, 2018"}
          title={'HTTP vs Websockets: A performance comparison'}
          url={"https://blog.feathersjs.com/http-vs-websockets-a-performance-comparison-da2533f13a77"}
        /> / 
        <Citation
          creator={'Arun Gupta'}
          creationDate={"February 24, 2014"}
          title={'REST vs WebSocket Comparison and Benchmarks'}
          url={"http://blog.arungupta.me/rest-vs-websocket-comparison-benchmarks/"}
        />
        .
        </p>

        <h4 id="321-socketio">3.2.1 <a href="http://socket.io" target="_blank">socket.io</a></h4>
        <p>In order to leverage existing solutions for WebSockets, we utilize <a href="http://socket.io" target="_blank">socket.io</a>, a robust Javascript library that serves as a WebSockets wrapper. In addition to a general WebSockets interface, <a href="http://socket.io" target="_blank">socket.io</a> also provides capabilities for broadcasting to compartmentalized sockets, a critical feature for player matchmaking, and support for asynchronous I/O.</p>

        {/* Synchronizing Networked Game State */}

        <h2 id="4-Synchronizing-Networked-Game-State">4 Synchronizing Networked Game State</h2>
        <p>Game state synchronization is the single biggest challenge in networked gaming. Once we have multiple users playing together in their browsers, how do we ensure they all see the same game world at the same time?</p>
        <p>We’ll start small and build our way up to a robust solution.</p>

        <h3 id="41-Transmitting-Inputs">4.1 Transmitting Inputs</h3>
        <p>No matter what, we know we need to share information about inputs between users. If we don’t, how will they know what other players are doing?</p>
        <p>We’ll use our central server to relay input messages from one client to another. Just like in our local single-player game, each player will have their own physics engine to simulate the game world. The game lifecycle looks like this:</p>
        <p><strong>&lt;clickable carousel&gt;</strong></p>
        <p>
          <img src="https://media.giphy.com/media/kspUpuXiE91yXHiYUn/giphy.gif" alt="Sending Inputs" />
        </p>
        <ol>
          <li>User clicks to drop a chip</li>
          <li>Client sends input notification to server, while client’s physics engine starts moving chip</li>
          <li>Server relays input to other clients</li>
          <li>Other clients add chip to their engine and display it</li>
        </ol>
        <p>We can think of this model as having “smart” clients and a “dumb” server:</p>
        <figure>
          <img src="https://i.imgur.com/MicK8yI.png" alt="Smart Clients" />
        </figure>

        <p>Unfortunately, we have a problem: the chip will start falling right away for player 1, but the other players won’t find out about it for anywhere from 20-300+ milliseconds due to the latency that’s inherent to communication over the internet. In the meantime, they’re dropping their own chips and their game engines are moving forward by several frames. If everyone finds out about each others’ chips at different times, each player’s game world is going to look a little different. What if two chips collide on one player’s screen, but not on another’s? The longer the game runs, the more the state will diverge. Pretty soon, two players’ games will look nothing alike.</p>

        <h4 id="411-Lockstep">4.1.1 Lockstep</h4>
        <p>One solution to this problem is to constrain the client game engines to update at the same time. We’ll send inputs to the server just like above, but the server doesn’t broadcast them right away. Instead, on each frame it waits to receive inputs (or a notification that no input occurred) from every single player. Once it’s heard from everyone, it will broadcast the set of inputs for that frame. Then, and only then, may the clients render the frame. To render the next frame, the server and clients have to start this process over again.</p>
        <p>This model is called <em>lockstep</em> because that’s exactly how the client engines move forward: together, in lockstep. It was one of the earliest approaches to networked gaming, and it’s still alive today in turn-based and strategy games
          <Citation
            creator={'Glenn Fiedler'}
            creationDate={"February 24, 2010"}
            title={'What Every Programmer Needs To Know About Game Networking'}
            contributingOrganization={'Gaffer On Games'}
            url={"https://gafferongames.com/post/what_every_programmer_needs_to_know_about_game_networking"}
          />
          . A big advantage is the small amount of bandwidth it tends to consume – no matter how complex the game world, we only need to network new inputs. But for an action or physics-based game like ours, it has two significant limitations:
        </p>
        <ol>
          <li>Everyone’s game will run at the speed of the slowest player connection</li>
          <li>Sending only inputs relies on <em>deterministic</em> behavior in the game engine</li>
        </ol>
        <p>Even if we were willing to sacrifice speed (a big if in real-time gaming) determinism is non-negotiable.</p>

        <h5 id="412-Determinism">4.1.2 Determinism</h5>
        <p>If our plan is to share new inputs among players and let their individual physics engines take care of the rest, we need be able to trust that each of those engines will produce exactly the same result. If we drop a chip in the same place at the same time under the same conditions, it should always behave in exactly the same way for every player.</p>
        <p>However, the vast majority of physics engines, including ours, are <em>not</em> deterministic. Physics engines rely on floating point numbers to calculate physical properties and forces, and floating point numbers are handled differently by different machines and operating systems 
          <Citation
            creator={'Glenn Fiedler'}
            creationDate={"November 29, 2014"}
            title={'Deterministic Lockstep: Keeping simulations in sync by sending only inputs'}
            contributingOrganization={'Gaffer On Games'}
            url={"https://gafferongames.com/post/deterministic_lockstep/"}
          />        
          . If floating point calculations aren’t deterministic, our game won’t be either. A small disparity in rounding might cause a chip to bounce left for one user and right for another, and soon our players’ game states have diverged just like before.
        </p>
        <p>At this point, it’s obvious that transmitting only inputs is not enough. How can we do better?</p>

        <h3 id="42-Transmitting-the-Entire-Game-State">4.2 Transmitting the Entire Game State</h3>
        <p>If we can’t rely on every client’s physics engine to give us deterministic behavior, we need to take control of the physics engine ourselves. We have an authoritative server, so let’s use it as an authority. So far, we’ve been running a physics engine on each client and using the server as a relay. Instead, we can run a single physics engine on the server and use the clients only as displays – a “smart” server with “dumb” clients.</p>
        <figure>
          <img src="https://i.imgur.com/6GlOUGR.png" alt="Smart Server" />
        </figure>
        <p>But if the clients are only responsible for rendering, how do they know <em>what</em> to render? For this to work, the server must continually broadcast snapshots of the entire game state for clients to display. Since clients no longer have their own physics engines, this is the only way they’ll know what’s happening in the game. It works like this:</p>
        <strong>&lt;clickable carousel&gt;</strong>
        <p>
          <img src="https://media.giphy.com/media/2wW4ERAjpwizH5t7TF/giphy.gif" alt="Snapshots" />
        </p>
        <ol>
          <li>User clicks to drop a chip</li>
          <li>Client notifies server of input (chip is not rendered yet)</li>
          <li>Server updates the game world</li>
          <li>Server broadcasts a snapshot of entire game state to all users</li>
          <li>All users, including the one who dropped chip, render the snapshot</li>
        </ol>
        <p>A snapshot is like a page in a flipbook. Alone, it’s a still picture. But when you view many together in a sequence, they appear to animate. To achieve our 60fps frame rate, clients must receive 60 pictures every second. In our game, a snapshot is a JavaScript object containing the current positions and owners of all chips and pegs, plus game data like current scores and a timestamp. Here’s how the client uses these snapshots in its <code>animate</code> function, which is called every 16.67 ms to animate the game:</p>

        {/* animate snippet goes here */}

        <p>With the snapshot approach, we’ve solved our state divergence problem. We can be confident all our players will see exactly the same game state, because there’s only one possible game state to see: the server’s. This is a huge improvement compared to our earlier attempt.</p>
        <p>Unfortunately, a fully synchronized game state doesn’t come for free. The snapshot implementation introduces a few new problems of its own...</p>

        <h4 id="421-Network-Jitter">4.2.1 Network Jitter</h4>
        <p>Ever experience the frustration of a stuttering video stream or a game that seems to skip through time? With snapshots, our game is going to jitter like this too. The server is broadcasting new frames every 16.67ms to achieve our 60fps but there is no guarantee that our clients will receive them in the same regularly spaced intervals. In fact, the unpredictability of the internet all but guarantees that won’t happen.</p>
        <p>If a client receives two snapshots right in a row, then none for a while, then another three all together, and so on, the game will appear jittery on screen. Luckily, we can mitigate this problem with a buffer.</p>

        <h3 id="42-Transmitting-the-Entire-Game-State">4.2 Transmitting the Entire Game State</h3>
        <p>If we can’t rely on every client’s physics engine to give us deterministic behavior, we need to take control of the physics engine ourselves. We have an authoritative server, so let’s use it as an authority. So far, we’ve been running a physics engine on each client and using the server as a relay. Instead, we can run a single physics engine on the server and use the clients only as displays – a “smart” server with “dumb” clients.</p>
        <figure>
          <img src="https://i.imgur.com/6GlOUGR.png" alt="Smart Server" />
        </figure>
        <p>But if the clients are only responsible for rendering, how do they know <em>what</em> to render? For this to work, the server must continually broadcast snapshots of the entire game state for clients to display. Since clients no longer have their own physics engines, this is the only way they’ll know what’s happening in the game. It works like this:</p>
        <strong>&lt;clickable carousel&gt;</strong>
        <p>
          <img src="https://media.giphy.com/media/2wW4ERAjpwizH5t7TF/giphy.gif" alt="Snapshots" />
        </p>
        <ol>
          <li>User clicks to drop a chip</li>
          <li>Client notifies server of input (chip is not rendered yet)</li>
          <li>Server updates the game world</li>
          <li>Server broadcasts a snapshot of entire game state to all users</li>
          <li>All users, including the one who dropped chip, render the snapshot</li>
        </ol>
        <p>A snapshot is like a page in a flipbook. Alone, it’s a still picture. But when you view many together in a sequence, they appear to animate. To achieve our 60fps frame rate, clients must receive 60 pictures every second. In our game, a snapshot is a JavaScript object containing the current positions and owners of all chips and pegs, plus game data like current scores and a timestamp. Here’s how the client uses these snapshots in its <code>animate</code> function, which is called every 16.67 ms to animate the game:</p>

        {/* snapshot snippet here */}

        <p>With the snapshot approach, we’ve solved our state divergence problem. We can be confident all our players will see exactly the same game state, because there’s only one possible game state to see: the server’s. This is a huge improvement compared to our earlier attempt.</p>
        <p>Unfortunately, a fully synchronized game state doesn’t come for free. The snapshot implementation introduces a few new problems of its own:</p>

        <h5 id="4211-Solution-Snapshot-Buffer">4.2.1.1 Solution: Snapshot Buffer</h5>
        <p>Right now, clients are rendering new snapshots as soon as they receive them. If they don’t get another one for a while, they’re stuck. Instead, we should have clients collect a few snapshots up front before they begin rendering. That way, they’ll have a reserve of snapshots to use in the event of a spike in network latency.</p>
        <figure>
         <img src="https://i.imgur.com/KylqZjL.png" alt="Snapshot Buffer" />
         <figcaption>Figure 4.2.1.1: Visualization of client processing snapshots with and without a buffer</figcaption>
        </figure>
        <p>Our buffer should function as a queue, so we’ll implement it using a singly linked list with references to both the head and tail. This gives us O(1) insertion at the tail and O(1) removal from the head.</p>
        <p>Now that we have a buffer for snapshots, let’s update our pseudocode for the client’s <code>animate</code> function:</p>

        {/* snapshot buffer snippet here */}

        <h4 id="422-High-Bandwidth-Consumption">4.2.2 High Bandwidth Consumption</h4>
        <p>In the lockstep approach, when we were transmitting only inputs over the network, our data needs were very small. Each new chip sent to the server required only a set of location coordinates and an id to show which player dropped it. Once the server processed the chip and broadcast all inputs for a given frame, clients could expect to receive a maximum of one chip object per player.</p>
        <p>With snapshots, the initial input data sent from client to server remains the same. However, the data broadcast back from the server is <em>much</em> larger. Now, the server must transmit the entire game world – all the chips, all the pegs, everything – to every player, 60 times every second. As you might imagine, this adds up quickly.</p>
        <p>Let’s compare our bandwidth, assuming there are 200 chips in the game and a new one is added every second:</p>
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
          <td>Bandwidth (kb/s)</td>
          <td>0.057</td>
          <td>900+</td>
          </tr>
          </tbody>
        </table>
        <p>This is an enormous difference. Luckily, there are two ways we can shrink our bandwidth consumption while still enjoying the advantages of snapshots. The first way is to reduce the <em>size</em> of the data we transmit. After that, we’ll look at the other option: reducing the <em>frequency</em> of the data we transmit.</p>

        <h5 id="4221-Binary-Serialization">4.2.2.1 Binary Serialization</h5>
        <p>In order to transmit data between clients and the server, the data must be converted into one of two formats that can be sent over the internet: a string, or a binary stream. This conversion process is called serialization.</p>
        <p>So far, we’ve been relying on WebSockets to automatically serialize our JavaScript objects into transmittable JSON strings for us. For a single chip in a snapshot, it looks a little something like this:</p>

        {/* object vs JSON table */}

        <p><small><em>Note that JSON strings don’t actually include newlines or other whitespace. We show them here for readability.</em></small></p>
        <p>The JSON string above is 76 characters, which means it takes 76 bytes to send over the network (1 byte per character). But if we put in some extra work to serialize our snapshots into binary, we can do <em>much</em> better.</p>
        <p>Binary serialization is the process of compressing our complex game data into a series of 0s and 1s. We’ll craft our own binary serialization algorithm for the server to use, which must take care of serializing all the game data we need to send in snapshots: chips, pegs, the score, and other state.</p>
        <Aside>
          <p>Before we take a stab at binary serialization, there’s a quick optimization we can make. You probably noticed that the values in the chip above include floating point numbers, some with many digits after the decimal. If we leave them as-is, we’ll need to represent every single digit in binary, even though there’s little or no perceivable difference between a chip rendered at x = 752.34235235235 (47 bits when serialized to binary) and a chip rendered at x = 752 (10 bits when serialized).</p>

          <p>To save ourselves some bits, we should <strong>quantize</strong> all our values before we serialize them. Here, quantization just means rounding to integers. (We do need to retain some decimals on the angle property for accuracy, so for that value we’ll round to three decimal points and multiply by 1000.)</p>
        </Aside>
        <p>Let’s take that old chip string and see what it looks like after the server quantizes the values and converts them to binary:</p>

        {/* JSON vs binary table */}

        <p>Our chip has shrunk from 76 bytes to just 8 bytes. That’s a size reduction of almost 90%!</p>

        <h6 id="Deserialization"><em>De</em>serialization</h6>
        <p>Once a client receives a serialized snapshot from the server, it must deserialize it before it can render the snapshot to the player. In order to deserialize a snapshot, the client and server must agree in advance on the format and length of the binary string. The client needs to know which bits refer to chips, which refer to pegs, and so on.</p>
        <p>We’ll tell the client in advance how to break up this data to be parsed:</p>
        <figure>
          <img src="https://i.imgur.com/OFRLlrv.png" alt="Deserializing a Snapshot" />
          <small><em>The first eight bits in the snapshot let the client know how many chips to expect. The next six give the number of pegs, and so on.</em></small>
        </figure>
        <p>Within the group of chips, how do we identify one individual chip? And in an individual chip, how do we know which bits represent its position, and which represent its ID or other data? Since we know one chip is 41 bits, we can zero in on the first 41 bits of the chip section:</p>
        <figure>
          <img src="https://i.imgur.com/OaAMwvE.png" alt="Deserializing a Chip" />
          <small><em>Note that we divide the angle by 1000 to account for the fact that the server multiplied it by 1000 during quantization.</em></small>
        </figure>

        <p>When we’ve completed this deserialization process for the whole binary string, the client will have converted all values back into JavaScript objects that it can use to render the game world.</p>
        <p>With binary serialization, a 15kb snapshot can be compressed to just 1.6kb. The data savings for our overall bandwidth is remarkable. Assuming 200 chips are in the game and we’re sending 60 snapshots per second:</p>

        {/* Unserialized vs serialized bandwidth table */}

        <h5 id="4222-Interpolation">4.2.2.2 Interpolation</h5>
        <p>We’ve covered sending <em>less</em> data with binary serialization, but it’s also possible to send game state data <em>less frequently</em>. What if, instead of sending a snapshot of every frame, the server only sends a snapshot of every <em>other</em> frame?</p>
        <p>We still want to animate our game at 60 frames per second for our players, so if clients only receive 30 frames per second, they will somehow need to create the missing frames on their own. The clients can achieve this by interpolating–guessing what happened–in between the frames they do receive. This strategy is called snapshot interpolation, and it effectively lets us chop our bandwidth consumption in half.</p>
        <p>Here’s how it works in an ideal scenario:</p>
        <strong>&lt;clickable carousel&gt;</strong>
        <p>
          <img src="https://media.giphy.com/media/e7PStfCzkGb8PqCMzB/giphy.gif" alt="Interpolation Good" />
        </p>
        <ol>
          <li>Actual path the chip took in the server’s physics engine</li>
          <li>Frames received by the client as snapshots</li>
          <li>Frames created by the client using linear interpolation</li>
          <li>The path rendered on the client vs. the actual path on the server – not exact, but very close!</li>
        </ol>
        <p>Here, the players will see the chip take almost the exact same path that it actually took in the server’s physics engine. Any small differences should be unnoticeable, and they’ll be corrected as soon as the client renders the next snapshot.</p>
        <p>Unfortunately, interpolation won’t always give us such good results. Remember that the client is guessing now, and sooner or later one of the guesses is bound to be wrong. In the previous example, the client happened to receive a snapshot of the exact moment when the chip hit a peg, but there is no guarantee this will always be the case.</p>
        <p>Imagine another scenario, where the chip takes the same path in the server engine, but the clients happen to receive different snapshots:</p>
        <strong>&lt;clickable carousel&gt;</strong>
        <p>
          <img src="https://media.giphy.com/media/4ZvDoeySKDG61963xB/giphy.gif" alt="Interpolation Bad" />
        </p>
        <ol>
          <li>Actual path the chip took in the server’s physics engine</li>
          <li>Frames received by the client as snapshots</li>
          <li>Frames created by the client using linear interpolation</li>
          <li>The path rendered on the client vs. the actual path on the server – the chip appears to bounce right for no reason</li>
        </ol>
        <p>Now the chip turns right right in mid-air, but the players never see it hit a peg. It’s as if the peg has a forcefield around it, which creates a jarring, unnatural effect.</p>
        <p>There is no simple solution to this problem. We could mitigate the risk of bad guesses by sending snapshots from the server more often, but this would defeat the purpose of using interpolation to reduce bandwidth in the first place.</p>

        <h4 id="423-Input-Lag">4.2.3 Input Lag</h4>
        <p>Last, relying on snapshots to keep our game state synchronized can result in input lag for players. If you take another look at Figure X (first snapshot carousel), you’ll see why. When a player clicks to drop a new chip into the game frame, they won’t see it right away. The chip must be sent to the server, processed by the server’s physics engine, and broadcast back in a snapshot before the player gets to see it.</p>
        <p>If a player has a fast internet connection and happens to live near the game server, they might not notice the delay. But if the player is on a slow network or lives halfway around the world, they may experience a round trip time of hundreds of milliseconds before seeing the result of their input.</p>

        {/* Latency by location table */}

        <p>(<a href="https://wondernetwork.com/pings" target="_blank">Wonder Network</a>)</p>
        <p>Research shows that humans perceive response times of under 100-150ms as instantaneous, but that anything longer appears noticeably delayed 
          <Citation
            creator={'Sergey Ignatchenko'}
            creationDate={"July 7, 2017"}
            title={'Development and Deployment of Multiplayer Online Games, Vol 1'}
          />
          . This means some players will have a much better gaming experience than others.
        </p>

        <h5 id="4231-Solution-…Is-There-One">4.2.3.1 Solution: …Is There One?</h5>
        <p>If we rely entirely on snapshots, there is no real solution for input lag. No matter what, new inputs must travel to the server and back again before clients can see them, not unlike in the earlier lockstep model.</p>
        <p>Many games utilize clever animations or other sleight of hand to distract players from these delays. If you’ve ever tried to cast a spell and been treated to a long sequence of wand flourishes before you make your move, input lag is likely to blame.</p>
        <p>If we want to avoid input lag entirely, we must find a way to predict the game state on the client <em>before</em> a snapshot is received. This means moving away from a pure snapshot implementation, which we’ll investigate next.</p>

        <h3 id="43-Predicting-the-Game-State">4.3 Predicting the Game State</h3>
        <p>Before we jump into how we can predict the state of our game, let’s consider how game state prediction works in general.</p>
        <h4 id="Mental-Model">Mental Model</h4>
        <p>Predicting game state from older state is a very common strategy many games use to create the illusion of a lag-free environment.</p>
        <p>Imagine a traditional platforming game: if a player performs an action or moves their avatar, there is an expectation of instant visual feedback even though the server does not yet have knowledge of any inputs. The client-side avatar begins moving right away and will synchronize with the server as information becomes available. The term for this is <strong>client-side prediction</strong>:</p>
        <figure>
          <img src="https://s1.gifyu.com/images/mario-cs-prediction.gif" alt="Client side prediction" />
        </figure>
        <p>Also, if another player temporarily loses connection, the other player clients can often correctly assume that the disconnected avatar will continue moving in the same direction. This represents what we call <strong>extrapolation</strong>:</p>
        <figure>
          <img src="https://s1.gifyu.com/images/mario-wifi.gif" alt="Extrapolation" />
        </figure>
        <p><em>Note: Client-side prediction and extrapolation are often conflated, but they are very similar in our game and can be handled the same way.</em></p>

        <h4 id="In-Our-Game">In Our Game</h4>
        <p>For prediction to work, both the client <em>and</em> the server must have a game engine. We can take advantage of prediction in our game by introducing a client-side physics simulation, so that both server and client will simulate their worlds in tandem. In other words, we need both the clients and the server to be “smart.”</p>
        <figure>
          <img src="https://i.imgur.com/9DcONlU.png" alt="Smart Clients and Server" />
        </figure>
        <p>Running a physics engine on both the clients and the server allows us to:</p>
        <ul>
        <li>Instantly render new chips on the client before the server knows about them</li>
        <li>Extrapolate chip behaviour in between snapshots from the server</li>
        </ul><p>Due to network latency, the client and server receive information about what is happening on the other “in the past”, which then needs to be reconciled. Let’s take a look at how the system works as a whole before focusing on the individual parts:</p>
      <figure>
          <img src="https://i.imgur.com/JVx8Ee4.png" alt="Extrapolation lifecycle" />
          <figcaption>Figure 4.3A: Round-trip lifecycle of an input</figcaption>
        </figure>
        <p>In the figure above, an input is made on frame <code>95</code>, but does not reach the server until frame <code>100</code>. However, both sides continue to simulate the game world during these 5 frames. Once the server receives the input, it needs to rewind the game <em>back</em> to frame <code>95</code> from frame <code>100</code>, and reenact what “actually” have happened.</p>
        <p>Once the reenactment is complete, it sends a snapshot of the entire game world at frame 100. Again, the game world continues forward while the snapshot is in transit.</p>
        <p>Finally, on frame <code>105</code>, the client receives the snapshot reflecting the authoritative state at <code>100</code> and “regenerates” the game world based on it. It must now fast forward up to the current frame in order to reflect what it thinks the server must be seeing at frame <code>105</code>.</p>

        <h5 id="Detailed-Overview">Detailed Overview</h5>
        <p>There is a fair amount of complexity hidden by the previous diagram, especially regarding the way reenactment operates on each side. What <em>actually</em> happens when an input is received by the server, or a snapshot is received by the client? Let’s take a look step-by-step:</p>
        <p>
          <img src="https://s1.gifyu.com/images/extrapolation-overview.gif" alt="Extrapolation overview animation" />
        </p>
        <pre><code>Carousel descriptions:
        (description) The client and server's visual output are represented with the current frame at the top right of each. Red chips and frame counters represent a reenactment.
        a) Client drops a chip, it appears instantly on their screen and begins dropping
        b) At the same time, the client sends input message to the server for `frame 1`
        c) Server receives input on `frame 4` about the `frame 1` input event
        d) Server rewinds state to `frame 1`, adds the chip, and begins reenacting up to `frame 4`, the current frame
        e) In the background, the server catches up to current frame, `frame 4`
        f) Server sends snapshot of world at `frame 4`
        g) Client receives snapshot on `frame 7`
        h) In the background, the client regenerates the world state from snapshot and reenacts up to frame 7
        i) Client is now caught up to current frame
        j) Both sides continue simulation
        </code></pre>

        <h4 id="431-Client-Side-Reenactment">4.3.1 Client-Side Reenactment</h4>
        <p>Without extrapolation, the client side is constantly receiving snapshots of the entire game state, buffering the snapshots and displaying them as soon as possible. Our approach changes when we begin extrapolating, because the client’s simulation is always ahead of the snapshot it just received.</p>
        <p>To account for this, the reenactment process on the client consists of two major components:</p>
        <ol>
          <li>Regeneration from the snapshot</li>
          <li>Fast forward to the current frame</li>
        </ol>
        <p>We can begin with an overview of the pseudocode executed during each frame. The gist is that if a snapshot exists, we perform regeneration and fast forward; otherwise, update the simulation as we normally would locally. Only the latest snapshot is used when regenerating; we do not buffer older snapshots as before since they are immediately stale.</p>

        {/* 4.3.1 snippet */}

        <h5 id="1-Regenerate-from-Snapshot">1. Regenerate from Snapshot</h5>
        <p>Regenerating from a snapshot entails two things: Updating the physical properties of chips which currently exist in the world, and creating chips which do not yet exist. If a chip in the snapshot does not exist in our world, it means that it is a newly dropped chip, so we must create and add it to the simulation and renderer.</p>

        {/* Regenerate from snapshot snippet */}

        <h5 id="2-Fast-Forward-to-Present">2. Fast Forward to Present</h5>
        <p>Fast forwarding to the current frame is simple: we simply move the engine forward one step for every frame that the snapshot is behind. It is important to note that this process happens in the background, as we do not want the renderer to be affected by the reenactment.</p>

        {/* Fast forward snippet */}

        <h4 id="432-Server-Side-Reenactment">4.3.2 Server-Side Reenactment</h4>
        <p>While clients are receiving a stream of snapshots, the server is enduring a constant wave of inputs from each client. Because each of these inputs are describing the past, the server must also perform a reenactment to settle on a state which includes the recent inputs.</p>

        <h5 id="Useful-Data-structures">Useful Data structures</h5>
        <p>Before we cover the implementation details of server-side reenactment, there are a few very useful data structures we can use to help: A <strong>snapshot history</strong> to keep track of all frames generated, an <strong>input history</strong> to keep track of all input events, and an <strong>input buffer</strong> to optimize how often we perform reenactments.</p>

        <Aside emphasized={true}>
          <h6 id="Snapshot-History">Snapshot History</h6>
          <p>Our server must keep a snapshot history of every single frame it has already simulated, and be able to recall it when a new input is received. As the only constraints here are a constant <code>O(1)</code> read time and delete time, we use a regular JavaScript object for our history with frames as keys and snapshots as values. This way, when we can access a historical frame and rewind to it in one step.</p>

          <h6 id="Input-History">Input History</h6>
          <p>But once we have rewound to a past frame, what happened to those inputs which occured between then and the current frame? It’s clear that we need to have an input history as well. Again, we used a JavaScript object for its <code>O(1)</code> read time; this time the value is the input itself (or an array of inputs), so as we fast-forward through each frame, we can check if an input exists in constant time, and process it if so.</p>

          <h6 id="Input-Buffer">Input Buffer</h6>
          <p>If we processed every input as it came in, the server would end up reenacting a lot more often than necessary. In the worst case scenario, every player might input a chip at the same frame, and we would reenact multiple times to produce a <em>single</em> snapshot.</p>
          <p>To resolve this, we want to package inputs from the same frame together. Instead of processing every single input as it comes in, we use a buffer to temporarily store the inputs and process them all into the input history before a reenactment.</p>
          <p>We implement this buffer using a linked list. This is because we consume the buffer from the head and linked lists provide an <code>O(1)</code> constant time shift operation. By maintaining a reference to the last input in the buffer, we also have <code>O(1)</code> insertion into the queue.</p>
        </Aside>

        <h6 id="Implementation">Implementation</h6>
        <p>Our high-level implementation is fairly straightforward:</p>
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
        <p>This is an example of our <code>animate</code> function on the server side:</p>

        {/* DS implementation snippet */}

        <h4 id="Restoring-World-from-a-Snapshot">Restoring World from a Snapshot</h4>
        <p>To rewind the state to a previous snapshot, there are 3 categories of chips which we need to handle, those which:</p>
        <ol>
          <li>Do not exist on the client, but exist in the snapshot</li>
          <li>Exist on the client <em>and</em> in the snapshot</li>
          <li>Exist on the client but not in the snapshot</li>
        </ol>
        <p>So our rewind step consists of iterating over the chips in the snapshot, creating chips that fall into <code>(1)</code> and updating chips that fall into <code>(2)</code>.</p>
        <p>Chips in category 3 result from the fact that we are going “back in time”, and the client world may contain new chips which are not present in the past. So after iterating over the snapshot, we remove any chips that fall into <code>(3)</code>.</p>

        {/* restoring world from snapshot snippet */}

        <h4 id="Reenactment">Reenactment</h4>
        <p>Server-side reenactment is reminiscent of the client-side fast forward, except we have a history of the every input made along the way. Because the rewind step removed chips which have been created since that frame, we must recreate those inputs by referencing the input history at every step.</p>
        <p>Also, because we need to retain a full history of every frame simulated, we need to update that history as we reenact frames, as that canonical history has been altered.</p>

        {/* server-side reenactment snippet */}

        <h4 id="434-Client-Side-State-Divergence">4.3.4 Client-Side State Divergence</h4>
        <p>One topic we have not yet discussed is what happens in the case when state diverges? With a pure snapshot approach, all clients are consistent with the server at every point in time. Now that there is a local client-side simulation, we might find that there is a disagreement between where we <em>think</em> our chip is, and where the reenactment indicates that it <em>“really”</em> is. In some cases, it is acceptable to simply “snap” to the new state, but there are some strategies to help smooth out the discrepancies more naturally.</p>

        <h5 id="Popping">Popping</h5>
        <p>When the client performs a reenactment and discovers that the current and the reenacted chip positions have diverged, it can simply render the new position and continue simulating. This can result in a “popping” effect, where the chip pops out of existence at one point, and back into existence elsewhere:</p>
        <figure>
          <img src="https://s1.gifyu.com/images/extrapolation-popping.gif" alt="Popping" />
        </figure>
        <p>While this works perfectly fine in the case where divergence is not severe, if the positions are dozens of pixels apart, the effect can be jarring and chips can appear to teleport. One of the most important aspects of a physics-based game is for objects to have a natural path which your eyes can follow. This creates the important illusion of continuity so that the viewer can register an object to persist between frames as the same object. If we were content for chips to pop, we would be sacrificing an important aspect of the player experience.</p>

        <h5 id="Solution-Bending">Solution: Bending</h5>
        <p>The best way to handle the problem of continuity with respect to state divergence is to perform bending (or smoothing). This means that once a new position is calculated, we don’t render it immediately, but instead continue rendering our <em>old</em> position. Then, over a period of 3-5 frames, we can “push” the old position towards the new one.</p>
        <figure>
          <img src="https://s1.gifyu.com/images/extrapolation-bending.gif" alt="Bending" />
        </figure>
        <pre><code>a) Client is extrapolating on the client engine
          b) We receive a snapshot about the state at  `frame 53` and rewind
          c) We have caught up to the current frame, so we begin bending
          d) We calculate the distance between the rendered position and the new simulated position, and use that to push the chip towards its actual position
          e) Bending is complete and we can continue extrapolating

          (accidentally labeled last frame as e instead of f)
          f) We can see from the final state that it is easy to follow the continuous chip path, at the expense of some unnatural behaviour such as going through a peg.

          note: This is exaggerated for effect, generally the divergence will be on a smaller scale.
        </code></pre>
        <p>The result is a smooth path which the eye can follow naturally, but the path may still appear to be “impossible” based on the physics.</p>

        <h6 id="Bending-Implementation">Bending Implementation</h6>
        <p>We can implement bending by snapping the physics to the new position immediately, while slowly updating the rendered position over the course of multiple frames. First we calculate the distance between the new and old object, then we render the old position plus some percentage of the distance.</p>

        {/* Bending implementation snippet */}

        <h4 id="435-Tradeoffs">4.3.5 Tradeoffs</h4>
        <p>Comparing prediction to relying solely on snapshots, we can see that incorporating prediction provides two major benefits:</p>
        <ul>
          <li><strong>Lower Bandwidth:</strong> Snapshots can be transmitted as infrequently as 5-10 times per second because a client-side simulation is so effective at estimating what occurs between snapshots.</li>
          <li><strong>Instant Feedback:</strong> The client gets instant visual feedback when an input is made by simulating and rendering it to the screen before any snapshot reflecting the input is received.</li>
        </ul>
        <p>In exchange for these benefits, there are some drawbacks:</p>
        <ul>
          <li><strong>Lag Compensation:</strong> Every communication must compensate for the latency between the client and server. While both client and server simulate in the “present”, all inputs and snapshots come from the “past”. Thus, the world must constantly be rewound and reenacted to maintain a real time experience.</li>
          <li><strong>More Computationally Intensive:</strong> Both the client and the server need to do considerably more work per frame. If one user experiences a high CPU load or has a slower computer, the computations necessary for reenactment might exceed the number of milliseconds available per frame. If this is the case, there may be a need to lower that client’s frame rate (along with raising his physics timestep) in order to extend this computation budget. Likewise, if the reenactment strain is too high on the server, the server would need to lower its own frame rate as well as every client’s.</li>
        </ul>

        <h4 id="436-Estimating-Latency">4.3.6 Estimating Latency</h4>
        <p>There’s one last thing we need to address. Our game implicitly expects that the clients and server are running on the same timeline. This means that if the server is on frame 100 we should expect any given client to be within at least a few frames of that when sending or receiving inputs. If this is not the case our game will break down because our game engine will be forced to reenact too far into the past. So how do we ensure that clients and server start the game in a synchronized manner and maintain a unified timeline? We estimate the average latency between a given client and the server.</p>
        <p>We need to estimate because there is no sure-fire of knowing the exact latency between the client and server. Part of this issue stems from the fact that no two clocks will ever agree on what the current time is and no two transmissions are guaranteed to take the exact amount of time. With that being said, we don’t need to be exact and a good estimate of latency is the best we can hope for. Utilizing the algorithm 
          <Citation
            creator={'Zachary Booth Simpson'}
            creationDate={"March 01, 2000"}
            title={'A Stream-based Time Synchronization Technique For Networked Computer Games'}
            url={"http://www.mine-control.com/zack/timesync/timesync.html"}
          />
          described below we are able to get an average latency estimate that’s sufficient for our purposes.
        </p>
        <p>
          <img src="https://media.giphy.com/media/1gXhpaKuQfwJoipAXq/giphy.gif" alt="Estimating Latency" />
        </p>
            Note: Below will be part of the caption in the carousel
          <ol>
            <li>The client stamps its current local time on a “time request” packet and sends to the server</li>
            <li>When the server receives the packet, the server stamps it’s own local time time and sends back to the client</li>
            <li>When the server receives the packet, the client subtracts its current local time from its sent time and divides by two to compute latency. It also subtracts its current time from server time to determine client-server time difference and adds in the half-latency to get the correct difference in clock times.</li>
            <li>The client repeats the previous steps 10 times and adds the results to a latency history</li>
            <li>The latency history is sorted lowest to highest and the median latency is taken</li>
            <li>All latencies above 1 standard-deviation from the median latency are discarded and the remaining samples are averaged.</li>
          </ol>
        <p>Now that we have a reliable means of estimating latency before the game starts each client can use this information to predict what frame of the simulation the server is on.</p>
        <p>While prediction adds complexity to our implementation, it allows us to reduce our bandwidth needs considerably and creates a better experience for the user.</p>

        {/* Finished Product */}

        <h2 id="5-Finished-Product">5 Finished Product</h2>
        <p>In the end, we’ve built a real-time, multiplayer, physics-based game using only JavaScript and the basic features of a browser. Our clients and authoritative server communicate over WebSockets, and we employ snapshots and extrapolation to synchronize game state across nodes. To optimize bandwidth, we compress network data using quantization and binary serialization. Our game lobby and player matchmaking system is built with React.</p>
        <p><strong>(gameplay video)</strong></p>
        <p>Find our finished implementation on <a href="https://github.com/plinko-team/plinko" target="_blank">Github</a>. Or play the game yourself <a href="/play" target="_blank">here</a>!</p>

        {/* Future Work */}

        <h2 id="6-Future-Work">6 Future Work</h2>

        <h3 id="61-Support-More-Players">6.1 Support More Players</h3>
        <p>Our game currently supports up to four active players at a time. This forced us to create a complex lobby system to queue up waiting players and move them into the game when their turn comes, but this is not an ideal solution. In the future, we would like to scale the game to support multiple simultaneous groups of players in separate rooms.</p>

        <h3 id="62-A-Pure-WebSocket-Implementation">6.2 A Pure WebSocket Implementation</h3>
        <p>We use <a href="http://Socket.io" target="_blank">Socket.io</a> as a wrapper for the WebSocket protocol and the associated WebSockets API. <a href="http://Socket.io" target="_blank">Socket.io</a> serves us well, but it also provides extraneous functionality we don’t need, while adding some extra overhead to our messages. We can cut out this data overhead by forgoing a library and interfacing directly with WebSockets.</p>

        <h2 id="About-Us">About Us</h2>
        <p>Our team of three web developers built Plinko remotely, working together from across North America. We pair-programmed, bug-squashed, and drank 3,425,718 cups of coffee.</p>
        <p><strong>&lt;pictures of our charming faces&gt;</strong></p>
        <p>Please feel free to get in touch if you’d like to talk software engineering, games, or the web. We’re always open to learning about new opportunities.</p>

        {/* Further Reading */}

        <h2 id="Further-Reading">Further Reading</h2>
        <p>If you’re interested in networked gaming, we recommend checking out the resources below, all of which were invaluable to our research.</p>
        <ul>
          <li><a href="https://gafferongames.com/" target="_blank">Gaffer On Games</a></li>
          <li><a href="https://www.koonsolo.com/news/dewitters-gameloop/" target="_blank">deWITTER’s Game Loop</a></li>
          <li><a href="http://ithare.com/contents-of-development-and-deployment-of-massively-multiplayer-games-from-social-games-to-mmofps-with-stock-exchanges-in-between/" target="_blank">Development and Deployment of Multiplayer Online Games</a></li>
        </ul>
      </div>
    </main>
  )
}

export default About;

{/*
<div id="doc" className="markdown-body container-fluid" style="position: relative;">


  While Loop Snippet
  <pre>
    <code className="javascript hljs">
      <span className="token keyword">while</span> <span className="token punctuation">(</span>gameIsRunning<span className="token punctuation">)</span> <span className="token punctuation">{</span>
      <span className="token function">processInputs</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token function">renderWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token punctuation">}</span>
    </code>
  </pre>

  Game Loop Snippet
  <pre>
    <code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">gameLoop</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      <span className="token function">requestAnimationFrame</span><span className="token punctuation">(</span>gameLoop<span className="token punctuation">)</span>
      <span className="token function">processInputs</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token function">renderWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token punctuation">}</span>
    </code>
  </pre>

  gameLoop Snippet 2.1.4
  <pre>
    <code className="javascript hljs">
      <span className="token keyword">function</span> <span className="token function">gameLoop</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      <span className="token function">requestAnimationFrame</span><span className="token punctuation">(</span>gameLoop<span className="token punctuation">)</span><span className="token punctuation">;</span>
      <span className="token comment">// `elapsedTime` describes how much time the last game loop took</span>
      elapsedTime
      <span className="token operator"></span> <span className="token function">currentTime</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token operator">-</span> lastFrameTime<span className="token punctuation">;</span>
      <span className="token comment">// `MAX_ELAPSED_TIME` ensures the renderer doesn't fall too far</span>
      <span className="token comment">// behind the simulation in the event of a processing spike</span>
      <span className="token keyword">if</span> <span className="token punctuation">(</span>elapsedTime <span className="token operator">&gt;</span> <span className="token constant">MAX_ELAPSED_TIME</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      elapsedTime <span className="token operator">=</span> <span className="token constant">MAX_ELAPSED_TIME</span><span className="token punctuation">;</span>
      <span className="token punctuation">}</span>
      accumulatedTime <span className="token operator">+=</span> elapsedTime<span className="token punctuation">;</span>
      <span className="token keyword">while</span> <span className="token punctuation">(</span>accumulatedTime <span className="token operator">&gt;=</span> <span className="token constant">TIMESTEP</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      <span className="token comment">// Advance the simulation by our fixed `TIMESTEP`, 16.67ms</span>
      <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token constant">TIMESTEP</span><span className="token punctuation">)</span><span className="token punctuation">;</span>
      accumulatedTime <span className="token operator">-=</span> <span className="token constant">TIMESTEP</span><span className="token punctuation">;</span>
      <span className="token punctuation">}</span>
      <span className="token comment">// `alpha` is a value between 0 and 1 that represents</span>
      <span className="token comment">// how far along the game loop is between the previous</span>
      <span className="token comment">// and current simulation steps</span>
      alpha <span className="token operator">=</span> accumulatedTime <span className="token operator">/</span> <span className="token constant">TIMESTEP</span><span className="token punctuation">;</span>
      <span className="token function">interpolate</span><span className="token punctuation">(</span>alpha<span className="token punctuation">)</span><span className="token punctuation">;</span>
      <span className="token function">renderWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">;</span>
      lastFrameTime <span className="token operator">=</span> <span className="token function">currentTime</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">;</span>
      <span className="token punctuation">}</span>
    </code>
  </pre>

  Animate snippet
  <pre>
    <code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">animate</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      <span className="token comment">// ...</span>
      <span className="token comment">// Get the latest snapshot received from the server</span>
      currentSnapshot <span className="token operator">=</span> <span className="token function">getSnapshot</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token comment">// Iterate over all chips that exist in the snapshot</span>
      currentSnapshot<span className="token punctuation">.</span>chips<span className="token punctuation">.</span><span className="token function">forEach</span><span className="token punctuation">(</span>chipInfo <span className="token operator">=&gt;</span> <span className="token punctuation">{</span>
      <span className="token keyword">if</span> <span className="token punctuation">(</span><span className="token function">chipAlreadyExists</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      <span className="token comment">// If this is an existing chip, update its properties with the</span>
      <span className="token comment">// data from the snapshot</span>
      <span className="token function">updateExistingChip</span><span className="token punctuation">(</span>chipInfo<span className="token punctuation">)</span>
      <span className="token punctuation">}</span> <span className="token keyword">else</span> <span className="token punctuation">{</span>
      <span className="token comment">// If this is a new chip the client hasn't seen yet, create a new</span>
      <span className="token comment">// chip object and add it to the renderer</span>
      <span className="token function">createNewChip</span><span className="token punctuation">(</span>chipInfo<span className="token punctuation">)</span>
      <span className="token function">addChipToRenderer</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token punctuation">}</span>
      <span className="token punctuation">}</span><span className="token punctuation">)</span>
      <span className="token function">renderGame</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
      <span className="token comment">// ...</span>
      <span className="token punctuation">}</span>
    </code>
  </pre>

  Snapshot snippet
  <pre><code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">animate</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// ...</span>
    <span className="token comment">// Get the latest snapshot received from the server</span>
    currentSnapshot <span className="token operator">=</span> <span className="token function">getSnapshot</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// Iterate over all chips that exist in the snapshot</span>
    currentSnapshot<span className="token punctuation">.</span>chips<span className="token punctuation">.</span><span className="token function">forEach</span><span className="token punctuation">(</span>chipInfo <span className="token operator">=&gt;</span> <span className="token punctuation">{</span>
    <span className="token keyword">if</span> <span className="token punctuation">(</span><span className="token function">chipAlreadyExists</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// If this is an existing chip, update its properties with the</span>
    <span className="token comment">// data from the snapshot</span>
    <span className="token function">updateExistingChip</span><span className="token punctuation">(</span>chipInfo<span className="token punctuation">)</span>
    <span className="token punctuation">}</span> <span className="token keyword">else</span> <span className="token punctuation">{</span>
    <span className="token comment">// If this is a new chip the client hasn't seen yet, create a new</span>
    <span className="token comment">// chip object and add it to the renderer</span>
    <span className="token function">createNewChip</span><span className="token punctuation">(</span>chipInfo<span className="token punctuation">)</span>
    <span className="token function">addChipToRenderer</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
    <span className="token punctuation">}</span><span className="token punctuation">)</span>
    <span className="token function">renderGame</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// ...</span>
    <span className="token punctuation">}</span>
  </code></pre>

  Snapshot buffer snippet
  <pre><code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">animate</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// ...</span>
    <span className="token comment">// If there are more than 5 frames in the buffer, the client is too far</span>
    <span className="token comment">// behind the server and should throw away excess frames to get back in sync  </span>
    <span className="token keyword">while</span> <span className="token punctuation">(</span>snapshotBuffer<span className="token punctuation">.</span>length <span className="token operator">&gt;</span> <span className="token number">5</span><span className="token punctuation">)</span> <span className="token punctuation">{</span> snapshotBuffer<span className="token punctuation">.</span><span className="token function">shift</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">}</span>
    <span className="token comment">// Get the first snapshot received from the server that hasn't been processed yet</span>
    currentSnapshot <span className="token operator">=</span> snapshotBuffer<span className="token punctuation">.</span><span className="token function">shift</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// If no snapshot exists to be processed, do not render a new frame</span>
    <span className="token keyword">if</span> <span className="token punctuation">(</span><span className="token operator">!</span>currentSnapshot<span className="token punctuation">)</span> <span className="token punctuation">{</span> <span className="token keyword">return</span> <span className="token punctuation">}</span>
    <span className="token comment">// Otherwise, iterate over all chips that exist in the snapshot</span>
    currentSnapshot<span className="token punctuation">.</span>chips<span className="token punctuation">.</span><span className="token function">forEach</span><span className="token punctuation">(</span>chipInfo <span className="token operator">=&gt;</span> <span className="token punctuation">{</span>
    <span className="token comment">// Update chip or create a new one, same as before</span>
    <span className="token punctuation">}</span><span className="token punctuation">)</span>
    <span className="token function">renderGame</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// ...</span>
    <span className="token punctuation">}</span>
  </code></pre>

  Object vs JSON table
  <table>
    <thead>
      <tr>
        <th>Before</th>
        <th>After</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>{</code><br><code>id: 255,</code><br><code>x: 752.34235235235,</code><br><code>y: 492.42452311111,</code><br><code>angle: 3.535450564755286</code><br><code>}</code></td>
        <td><code>'{</code><br><code>"id":255,</code><br><code>"x":752.34235235235,</code><br><code>"y":492.42452311111,</code><br><code>"angle":3.535450564755286</code><br><code>}'</code></td>
      </tr>
    </tbody>
  </table>

  JSON vs binary table
  <table>
    <thead>
      <tr>
        <th>JSON</th>
        <th>Binary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>'{</code><br><code>"id":255,</code><br><code>"x":752.34235235235,</code><br><code>"y":492.42452311111,</code><br><code>"angle":3.535450564755286</code><br><code>}'</code></td>
        <td><code>11111111</code><br><code>1011110000</code><br><code>0111101100</code><br><code>0110111001111</code></td>
      </tr>
      <tr>
        <td><strong>76 bytes</strong> (608 bits)</td>
        <td><strong>8 bytes</strong> (41 bits)</td>
      </tr>
    </tbody>
  </table>

  Unserialized vs serialized bandwidth table
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
        <td>Bandwidth (kb/s)</td>
        <td>900</td>
        <td>96</td>
      </tr>
    </tbody>
  </table>

  Latency by location table
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

  4.3.1 snippet
  <pre><code className="javascript hljs">
    <span className="token keyword">function</span>
    <span className="token function">animate</span>
    <span className="token punctuation">(</span>
    <span className="token punctuation">)</span>
    <span className="token punctuation">{</span>
    <span className="token keyword">if</span>
    <span className="token punctuation">(</span>
    <span className="token function">latestSnapshotExists</span>
    <span className="token punctuation">(</span>
    <span className="token punctuation">)</span>
    <span className="token punctuation">)</span>
    <span className="token punctuation">{</span>
    snapshot <span className="token operator">=</span>
    <span className="token function">getLatestSnapshot</span>
    <span className="token punctuation">(</span>
    <span className="token punctuation">)</span>
    <span className="token comment">// Regenerate world from latest snapshot then catch up </span>
    <span className="token comment">// to the current frame</span>
    <span className="token function">regenerateFromSnapshot</span>
    <span className="token punctuation">(</span>snapshot<span className="token punctuation">)</span>
    <span className="token function">catchUpToCurrentFrameFrom</span>
    <span className="token punctuation">(</span>snapshot<span className="token punctuation">.</span>frame
    <span className="token punctuation">)</span>
    <span className="token function">deleteLatestSnapshot</span>
    <span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// Make room for next snapshot</span>
    <span className="token punctuation">}</span>
    <span className="token comment">// Always move the engine ahead one step</span>
    <span className="token comment">// because we are always extrapolating</span>
    <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    frame <span className="token operator">+=</span> <span className="token number">1</span>
    <span className="token punctuation">}</span>
  </code></pre>

  Regenerate from snapshot snippet
  <pre><code className="javascript hljs">
    <span className="token keyword">function</span>
    <span className="token function">regenerateFromSnapshot</span>
    <span className="token punctuation">(</span>snapshot
    <span className="token punctuation">)</span>
    <span className="token punctuation">{</span>snapshot
    <span className="token punctuation">.</span>chips
    <span className="token punctuation">.</span>
    <span className="token function">forEach</span>
    <span className="token punctuation">(</span>chipInfo
    <span className="token operator">=&gt;</span>
    <span className="token punctuation">{</span>
    <span className="token keyword">if</span>
    <span className="token punctuation">(</span>
    <span className="token function">chipDoesNotExist</span>
    <span className="token punctuation">(</span>
    <span className="token punctuation">)</span>
    <span className="token punctuation">)</span>
    <span className="token punctuation">{</span>
    <span className="token function">createChip</span>
    <span className="token punctuation">(</span>chipInfo
    <span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
    <span className="token comment">// Get a reference to the chip, either newly created or already existing</span> chip
    <span className="token operator">=</span>
    <span className="token function">getChipById</span>
    <span className="token punctuation">(</span>chipInfo
    <span className="token punctuation">.</span>id<span className="token punctuation">)</span>
    <span className="token comment">// Adjust physical properties based on snapshot's properties</span>
    <span className="token function">updateChipProperties</span>
    <span className="token punctuation">(</span>chip
    <span className="token punctuation">,</span> chipInfo
    <span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
    <span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
  </code></pre>

  Fast forward snippet
  <pre><code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">catchUpToCurrentFrameFrom</span><span className="token punctuation">(</span>frame<span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// Indicate that we should not render reenactment steps</span>
    <span className="token function">toggleReenactmentOn</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// Fast-forward up to current frame with the engine</span>
    <span className="token keyword">while</span> <span className="token punctuation">(</span>frame <span className="token operator">&lt;</span> <span className="token function">currentFrame</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      frame <span className="token operator">+=</span> <span className="token number">1</span>
      <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
    <span className="token function">toggleReenactmentOff</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
  </code></pre>

  DS implementation snippet
  <pre><code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">animate</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token keyword">if</span> <span className="token punctuation">(</span><span className="token function">inputBufferNotEmpty</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
    frame <span className="token operator">=</span> inputBuffer<span className="token punctuation">.</span><span className="token function">earliestFrame</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token comment">// Empty inputBuffer into inputHistory</span>
    <span className="token keyword">while</span> <span className="token punctuation">(</span><span className="token function">inputBufferNotEmpty</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
      input <span className="token operator">=</span> inputBuffer<span className="token punctuation">.</span><span className="token function">shift</span><span className="token punctuation">(</span><span className="token punctuation">)</span> <span className="token comment">// Get first input</span>
      <span className="token comment">// Store it according to its frame in inputHistory</span>
      inputHistory<span className="token punctuation">.</span><span className="token function">add</span><span className="token punctuation">(</span>input<span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
    <span className="token comment">// Get snapshot for frame of first input in buffer</span>
    snapshot <span className="token operator">=</span> snapshotHistory<span className="token punctuation">.</span><span className="token function">at</span><span className="token punctuation">(</span>frame<span className="token punctuation">)</span>
    <span className="token function">restoreWorldFromSnapshot</span><span className="token punctuation">(</span>snapshot<span className="token punctuation">)</span> <span className="token comment">// Rewind</span>
    <span className="token function">catchUpToCurrentFrameFrom</span><span className="token punctuation">(</span>frame<span className="token punctuation">)</span> <span className="token comment">// Reenact</span>
    <span className="token punctuation">}</span>
    <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    frame <span className="token operator">+=</span> <span className="token number">1</span>
    <span className="token punctuation">}</span>
  </code></pre>

  restoring world from snapshot snippet
  <pre><code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">restoreWorldFromSnapshot</span><span className="token punctuation">(</span>snapshot<span className="token punctuation">)</span> <span className="token punctuation">{</span>
    snapshot<span className="token punctuation">.</span>chips<span className="token punctuation">.</span><span className="token function">forEach</span><span className="token punctuation">(</span>chipInfo <span className="token operator">=&gt;</span> <span className="token punctuation">{</span>
    <span className="token comment">// Category 1; new chips</span>
    <span className="token keyword">if</span> <span className="token punctuation">(</span><span className="token function">chipIsNewToWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span> <span className="token function">createChip</span><span className="token punctuation">(</span>chipInfo<span className="token punctuation">)</span> <span className="token punctuation">}</span>
    <span className="token comment">// Category 2; update chips</span>
    chip <span className="token operator">=</span> <span className="token function">getChipFromWorldById</span><span className="token punctuation">(</span>id<span className="token punctuation">)</span>
    chip<span className="token punctuation">.</span><span className="token function">updateProperties</span><span className="token punctuation">(</span>chipInfo<span className="token punctuation">)</span>
    <span className="token punctuation">}</span><span className="token punctuation">)</span>

    <span className="token comment">// Category 3; remove chips</span>
    <span className="token function">deleteChipsNotInSnapshot</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
  </code></pre>

  server-side reenactment snippet
  <pre><code className="javascript hljs"><span className="token keyword">function</span> <span className="token function">catchUpToCurrentFrameFrom</span><span className="token punctuation">(</span>frame<span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// `frame` is the frame from the first buffered input</span>
    <span className="token keyword">while</span> <span className="token punctuation">(</span>frame <span className="token operator">&lt;</span> <span className="token function">currentFrame</span><span className="token punctuation">(</span><span className="token punctuation">)</span><span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// If there are inputs at the current frame, we need to</span>
    <span className="token comment">// process them by creating and adding chips to the world</span>
    inputs <span className="token operator">=</span> <span className="token function">inputsAtCurrentFrame</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    <span className="token keyword">if</span> <span className="token punctuation">(</span>inputs<span className="token punctuation">)</span> <span className="token punctuation">{</span>
      inputs<span className="token punctuation">.</span><span className="token function">forEach</span><span className="token punctuation">(</span>input <span className="token operator">=&gt;</span> <span className="token function">createChip</span><span className="token punctuation">(</span>input<span className="token punctuation">)</span><span className="token punctuation">)</span>
    <span className="token punctuation">}</span>
    <span className="token comment">// Our snapshot history keeps a snapshot for every frame</span>
    <span className="token comment">// Now that we've modified the past state,</span>
    <span className="token comment">// it needs to be overwritten</span>
    generatedSnapshot <span className="token operator">=</span> <span className="token function">generateSnapshot</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    snapshotHistory<span className="token punctuation">.</span><span className="token function">update</span><span className="token punctuation">(</span>frame<span className="token punctuation">,</span> generatedSnapshot<span className="token punctuation">)</span>
    <span className="token comment">// Finally, we move the engine forward by one tick</span>
    <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    frame <span className="token operator">+=</span> <span className="token number">1</span>
    <span className="token punctuation">}</span>
    <span className="token comment">// After the while loop has executed, our world state will be back at the</span>
    <span className="token comment">// current frame, including the new inputs</span>
    <span className="token punctuation">}</span>
  </code></pre>

  Bending implementation snippet
  <pre><code className="javascript hljs">
    <span className="token comment">// Determine the number of frames before the position will converge</span>
    totalBendingFrames <span className="token operator">=</span> <span className="token number">4</span>
    bendingFrame <span className="token operator">=</span> <span className="token number">1</span>
    <span className="token keyword">while</span> <span className="token punctuation">(</span>bendingFrame <span className="token operator">!==</span> totalBendingFrames<span className="token punctuation">)</span> <span className="token punctuation">{</span>
    <span className="token comment">// Calculate bending factor. It can be a constant factor, </span>
    <span className="token comment">// or dependent on number of bending frames</span>
    bendingFactor <span className="token operator">=</span> <span className="token number">1</span> <span className="token operator">/</span> <span className="token punctuation">(</span>totalBendingFrames <span className="token operator">-</span> bendingFrame<span className="token punctuation">)</span>
    <span className="token comment">// Calculate the distance between new and old position</span>
    deltaX <span className="token operator">=</span> simulatedPosition<span className="token punctuation">.</span>x <span className="token operator">-</span> renderedPosition<span className="token punctuation">.</span>x
    deltaY <span className="token operator">=</span> simulatedPosition<span className="token punctuation">.</span>y <span className="token operator">-</span> renderedPosition<span className="token punctuation">.</span>y
    <span className="token comment">// Update rendered position</span>
    renderedPosition<span className="token punctuation">.</span>x <span className="token operator">+=</span> deltaX <span className="token operator">*</span> bendingFactor
    renderedPosition<span className="token punctuation">.</span>y <span className="token operator">+=</span> deltaY <span className="token operator">*</span> bendingFactor
    <span className="token function">updateWorld</span><span className="token punctuation">(</span><span className="token punctuation">)</span>
    bendingFrame<span className="token operator">++</span>
    <span className="token punctuation">}</span>
  </code></pre>



  <div dir="ltr" className="resize-sensor" style="position: absolute; left: -10px; top: -10px; right: 0px; bottom: 0px; overflow: hidden; z-index: -1; visibility: hidden;"><div className="resize-sensor-expand" style="position: absolute; left: -10px; top: -10px; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0px; top: 0px; transition: all 0s ease 0s; width: 100000px; height: 100000px;"></div></div><div className="resize-sensor-shrink" style="position: absolute; left: -10px; top: -10px; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s; width: 200%; height: 200%"></div></div></div></div>




  */}
