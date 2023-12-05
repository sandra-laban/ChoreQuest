// NotificationBar.js

import { useEffect, useState } from 'react'
import { configureSocket } from '../apis/websocket'
import { useAuth0 } from '@auth0/auth0-react'

const NotificationBar = () => {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    console.log('web stuff')
    const connectWebSocket = async () => {
      const socket = await configureSocket()

      if (socket) {
        const handleData = (receivedData: any) => {
          console.log('receivedData', receivedData)
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            receivedData.notificationMessage,
          ])
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
      {notifications.map((notification, index) => (
        <p key={index}>{notification}</p>
      ))}
    </div>
  )
}

export default NotificationBar
