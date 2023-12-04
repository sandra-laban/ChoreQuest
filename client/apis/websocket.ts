// socketConfig.js

import io from 'socket.io-client'

const configureSocket = async (accessTokenPromise: any) => {
  try {
    // Get access token
    const accessToken = await accessTokenPromise
    // Create the WebSocket connection with the access token
    const socket = io('http://localhost:3000', {
      auth: {
        token: accessToken,
        user: 'test',
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    return socket
  } catch (error) {
    console.error('Error configuring WebSocket:', error)
    return null
  }
}

export default configureSocket
