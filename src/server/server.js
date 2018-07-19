import path from 'path'
import http from 'http'
import socket from 'socket.io'
import express from 'express'
import startLocalTunnel from './tunnel'

const app = express()
const server = http.Server(app)
const io = socket(server)

// Sets 'public' to serve static files
app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.emit('connection established', {})
});

startLocalTunnel();

server.listen(3000)
