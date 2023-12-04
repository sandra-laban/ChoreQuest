// socketAuth.ts

import { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import jwks from 'jwks-rsa'

const domain = 'https://your-auth0-domain.com' // Replace with your Auth0 domain
const audience = 'your-api-audience' // Replace with your API audience

const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token as string

  jwt.verify(
    token,
    jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${domain}/.well-known/jwks.json`,
    }),
    {
      audience: audience,
      issuer: `${domain}/`,
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        console.error(err)
        return next(new Error('Authentication error'))
      }

      // Attach the decoded token to the socket for further use
      (socket as any).decodedToken = decoded // Use `any` type to assign a custom property to Socket
      next()
    }
  )
}

export default authenticateSocket
