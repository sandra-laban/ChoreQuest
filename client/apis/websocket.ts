import io from 'socket.io-client'

let socketInstance: any = null

const configureSocket = async () => {
  try {
    if (socketInstance) {
      return socketInstance
    }

    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    socketInstance = socket
    return socket
  } catch (error) {
    console.error('Error configuring WebSocket:', error)
    return null
  }
}

export { configureSocket, socketInstance }
