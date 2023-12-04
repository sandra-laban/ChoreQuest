import { Server as SocketIoServer, Socket } from 'socket.io'
import checkJwt, { JwtRequest } from '../auth0'

const handleSocketMessages = (io: SocketIoServer) => {

  io.on(
    'connection',
    async (socket: Socket & { decodedToken?: JwtRequest['auth'] }) => {
      try {
        // Access user information from the handshake object (assuming the client sends it during connection)
        const user = socket.handshake.auth.user

        // Authenticate the user using checkJwt middleware
        const jwtRequest: any = {
          headers: { authorization: `Bearer ${user.token}` },
        }
        await checkJwt(jwtRequest, {} as any, () => {}) // The third argument is the next function, which we don't need

        console.log('A user connected:', user)

        socket.decodedToken = jwtRequest.auth

        socket.on('update_query_key', (data) => {
          console.log('Need to update this querykey for', data)
        })

        socket.on('disconnect', () => {
          console.log('A user disconnected from WebSocket')
        })
      } catch (error) {
        console.error('Authentication failed:', error)
        socket.disconnect(true)
      }
    }
  )
}

export default handleSocketMessages
