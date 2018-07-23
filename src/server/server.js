import path from 'path'
import http from 'http'
import socket from 'socket.io'
import express from 'express'
import startLocalTunnel from './tunnel'
import ServerEngine from './serverEngine'

const app = express()
const server = http.Server(app)
const io = socket(server)

// Sets 'public' to serve static files
app.use(express.static('public'));

const serverEngine = new ServerEngine();

let playerId = 0
let i = 0;
io.on('connection', socket => {
  socket.emit('connection established', { playerId: playerId % 4 })
  playerId++;

  // Events must be set on socket established through connection
  socket.on('new chip', (chipInfo) => {
    socket.emit('new chip', chipInfo)
    socket.broadcast.emit('new chip', chipInfo)
  })

  socket.on('pingMessage', () => {
    socket.emit('pongMessage', { serverTime: Date.now() })
  })

  socket.on('request genesis time', () => {
    socket.emit('genesis time', { genesisTime: serverEngine.genesisTime })
  })
});

startLocalTunnel();

server.listen(3000)
