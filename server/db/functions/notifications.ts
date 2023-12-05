import connection from './../connection'

const db = connection

export async function getUserNotifications(authId: string): Promise<any> {
  const notifications = await db('notifications').where('auth_id', authId)

  return notifications
}

export async function addUserNotification(
  authId: string,
  message: string
): Promise<any> {
  console.log('db', authId, message)
  const notifications = await db('notifications').insert({
    auth_id: authId,
    message,
  })

  return 10
}
