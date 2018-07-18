import path from 'path'
import http from 'http'
import socket from 'socket.io'
import localtunnel from 'localtunnel'
import express from 'express'

const app = express()
const server = http.Server(app)
const io = socket(server)

// Sets 'public' to serve static files
app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.emit('connection established', {})
});


const tunnel = localtunnel(3000, {subdomain: 'radioactive-kittens'}, (err, tunnel) => {
  console.log(tunnel.url)
})

tunnel.on('close', function() {
  console.log('tunnel closed :(')
});

server.listen(3000)
