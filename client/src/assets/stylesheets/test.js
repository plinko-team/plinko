

let targetDelta = 0.0166; /* 16.6ms ~ 60fps */
let previousTime = Date.now();

while (gameIsRunning) {
  let currentTime = Date.now();
  let deltaTime = currentTime - previousTime;

  processEvents();
  updateWorld(deltaTime);
  renderWorld();

  previousTime = currentTime;

  let frameTime = (Date.now() - currentTime);
  if (frameTime < targetDelta) {
    /* wait targetDelta - frameTime seconds */
  }
}


let targetDelta = 0.0166; /* 16.6ms ~ 60fps */
let previousTime = Date.now();
let maxDelta = 0.05;

while (gameIsRunning) {
  let currentTime = Date.now();
  let deltaTime = currentTime - previousTime;

  processEvents();
  updateWorld(deltaTime);
  renderWorld();

  previousTime = currentTime;

  let frameTime = (Date.now() - currentTime);
  if (frameTime < targetDelta) {
    /* wait targetDelta - frameTime seconds */
  }
}


