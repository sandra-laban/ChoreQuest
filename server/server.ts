// server.js

import express from 'express'
import http from 'http'
import * as Path from 'node:path'
import { Server as SocketIoServer } from 'socket.io'
import cors from 'cors'

import choresRoutes from './routes/chores'
import usersRoutes from './routes/user'
import familyRoutes from './routes/family'
import prizesRoutes from './routes/prizes'
import handleSocketMessages from './webSocketConnection/sockerHandler'

const server = express()
const httpServer = http.createServer(server)
const io = new SocketIoServer(httpServer)

server.use(cors())
server.use(express.json())

server.use('/api/v1/chores', choresRoutes)
server.use('/api/v1/user', usersRoutes)
server.use('/api/v1/family', familyRoutes)
server.use('/api/v1/prizes', prizesRoutes)

// Handle socket messages in a separate file
handleSocketMessages(io)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default httpServer
