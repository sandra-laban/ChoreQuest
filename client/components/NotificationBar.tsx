// NotificationBar.js
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { configureSocket } from '../apis/websocket'
import { useAuth0 } from '@auth0/auth0-react'
import { getNotifications } from '../apis/Notifications'

const NotificationBar = () => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()

  const {
    data: notifications,
    error,
    isPending,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getNotifications(accessToken)
    },
  })

  useEffect(() => {
    const connectWebSocket = async () => {
      const socket = await configureSocket()

      if (socket) {
        const handleData = (receivedData: any) => {
          console.log('query keys', receivedData.queryKey)
          queryClient.invalidateQueries({ queryKey: receivedData.queryKey })
        }

        socket.on('notification_data', handleData)
      }
    }

    connectWebSocket()
  }, [accessTokenPromise])

  return (
    <div>
      <h2>NotificationBar</h2>
      {notifications &&
        notifications.map((notification) => (
          <p key={notification.id}>{notification.message}</p>
        ))}
    </div>
  )
}

export default NotificationBar
