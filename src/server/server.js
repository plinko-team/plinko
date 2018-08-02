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

const serverEngine = new ServerEngine({ io }).init();
serverEngine.startGame();

// startLocalTunnel();

server.listen(3001)
