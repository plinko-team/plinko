plinko/
  client/ (react app)
    public/
      images/
      stylesheets/
      index.html
    src/
      components/
      index.js
    node_modules
    package.json (use a proxy here to avoid CORS issues)

  node_modules/
  package.json (2 different start scripts for client and server)
  server/
    serverEngine.js
  shared/
  etc.

TODO:
-combine NewGameButton, EndGameButton, and StartGameButton into single GameButton component
-validation and error notification on name form
-research:
  -cookies/persistent user ids
-vertical alignment for score list when players < 4
-handle game over
  -stop bar moving
-on new game clear out the old game
-animate score bars/target
