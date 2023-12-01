import express from 'express'
import * as Path from 'node:path'

import choresRoutes from './routes/chores'
import usersRoutes from './routes/users'
import familyRoutes from './routes/family'
import prizesRoutes from './routes/prizes'

const server = express()

server.use(express.json())

server.use('/api/v1/chores', choresRoutes)
server.use('/api/v1/user', usersRoutes)
server.use('/api/v1/family', familyRoutes)
server.use('/api/v1/prizes', prizesRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
