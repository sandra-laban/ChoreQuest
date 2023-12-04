// NotificationBar.js

import { useEffect } from 'react'
import configureSocket from '../apis/websocket' // assuming you have a file to configure the socket

const NotificationBar = ({ accessToken }: { accessToken: string }) => {
  useEffect(() => {
    const connectWebSocket = async () => {
      const socket = await configureSocket(accessToken)

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
  }, [accessToken])

  return (
    <div>
      <h2>NotificationBar</h2>
    </div>
  )
}

export default NotificationBar
