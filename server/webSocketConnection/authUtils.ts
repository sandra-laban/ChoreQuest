import jwt, { JwtPayload } from 'jsonwebtoken'
import {} from 'express-jwt'
import jwks from 'jwks-rsa'

// Auth0 configuration
const domain = 'manaia-2023-pete.au.auth0.com'
const audience = 'https://chorequest/api'

// Create a function to verify JWT tokens
export const verifyJwt = async (token: string): Promise<JwtPayload> => {
  console.log('Token:', token)

  const getPublicKeyOrSecret: jwt.Secret | any = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${domain}/.well-known/jwks.json`,
  })

  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(
      token,
      getPublicKeyOrSecret,
      {
        audience: audience,
        issuer: `${domain}/`,
        algorithms: ['RS256'],
      },
      (error, decoded) => {
        console.log('Decoded:')
        if (error) {
          reject(new Error(`Error verifying JWT: ${error.message}`))
        } else {
          resolve(decoded as JwtPayload)
        }
      }
    )
  })
}
