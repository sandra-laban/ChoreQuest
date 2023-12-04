import { Server as SocketIoServer, Socket } from 'socket.io'
import { Secret, verify, JwtPayload, JsonWebTokenError } from 'jsonwebtoken'
import jwks from 'jwks-rsa'

const domain = 'https://manaia-2023-pete.au.auth0.com'

// Explicitly type getPublicKeyOrSecret as ExpressJwtSecret, which extends Secret
const getPublicKeyOrSecret: any = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${domain}/.well-known/jwks.json`,
})

export const verifyJwt = async (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    // Ensure that getPublicKeyOrSecret is explicitly cast as Secret
    verify(
      token,
      getPublicKeyOrSecret as Secret,
      (error: JsonWebTokenError | null, decoded) => {
        if (error) {
          reject(error)
        } else {
          resolve(decoded as JwtPayload)
        }
      }
    )
  })
}

const handleSocketMessages = (io: SocketIoServer) => {
  io.on(
    'connection',
    async (socket: Socket & { decodedToken?: JwtPayload }) => {
      try {
        console.log('A user connected to WebSocket')
        // Access user information from the authentication token
        const authToken = socket.handshake.auth.token

        console.log('authToken', authToken)

        // Verify the token asynchronously and store the decoded payload in the socket object
        const decodedToken = await verifyJwt(authToken)

        console.log(decodedToken)

        // const user = socket.decodedToken.user

        // console.log('A user connected:', user)

        socket.on('update_query_key', (data) => {
          console.log('Need to update this query key for', data)
        })

        socket.on('disconnect', () => {
          console.log('A user disconnected from WebSocket')
        })
      } catch (error) {
        console.error('Error during WebSocket connection:', error)
        socket.disconnect(true)
      }
    }
  )

  io.on('error', (error) => {
    console.error('WebSocket server error:', error)
  })
}

export default handleSocketMessages
