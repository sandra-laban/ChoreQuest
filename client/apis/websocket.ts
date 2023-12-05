import io from 'socket.io-client'

let socketInstance: any = null
;('https://chorequest.pushed.nz')
;('http://localhost:3000')
const configureSocket = async () => {
  try {
    if (socketInstance) {
      return socketInstance
    }

    const socket = io('https://chorequest.pushed.nz', {
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
