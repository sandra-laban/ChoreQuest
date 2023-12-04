// NotificationBar.js

import { useEffect } from 'react'
import configureSocket from '../apis/websocket' // assuming you have a file to configure the socket
import { useAuth0 } from '@auth0/auth0-react'

const NotificationBar = () => {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()

  useEffect(() => {
    const connectWebSocket = async () => {
      const socket = await configureSocket(accessTokenPromise)

      if (socket) {
        const handleData = (receivedData: any) => {
          console.log('Received data from server:', receivedData)
        }

        socket.on('notification_data', handleData)

        return () => {
          socket.off('notification_data', handleData)
        }
      }
    }

    connectWebSocket()
  }, [accessTokenPromise])

  return (
    <div>
      <h2>NotificationBar</h2>
    </div>
  )
}

export default NotificationBar
