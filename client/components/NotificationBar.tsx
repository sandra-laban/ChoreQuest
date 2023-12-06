// NotificationBar.js
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { configureSocket } from '../apis/websocket'
import { useAuth0 } from '@auth0/auth0-react'
import { getNotifications, deleteNotification } from '../apis/notifications'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../apis/userApi'
const NotificationBar = () => {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  const navigate = useNavigate()

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return await getNotifications(accessToken)
    },
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return await getUser(accessToken)
    },
  })

  const connectWebSocket = async () => {
    const socket = await configureSocket()

    if (socket) {
      socket.on('notification_data', ({ queryKey }: { queryKey: string[] }) => {
        queryKey.forEach((keyName) => {
          console.log('keyName', keyName)
          queryClient.invalidateQueries({ queryKey: [keyName] })
        })
      })
      console.log('socket connected')
    }
  }

  useEffect(() => {
    connectWebSocket()
  }, [])

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const accessToken = await getAccessTokenSilently()
      return await deleteNotification(accessToken, notificationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleClick = async (pageUrl: string, id: string) => {
    deleteNotificationMutation.mutate(id)
    navigate(pageUrl)
  }
  return (
    <div>
      <h2>NotificationBar</h2>
      {notifications && notifications.length > 0 ? (
        notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => handleClick(notification.pageUrl, notification.id)}
            className="text-sm border-none"
          >
            {notification.message}
          </button>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  )
}

export default NotificationBar
