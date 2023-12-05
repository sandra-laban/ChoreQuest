import connection from './../connection'

const db = connection

export async function getUserNotifications(authId: string): Promise<any> {
  const notifications = await db('notifications')
    .select('auth_id as authId', 'message', 'id', 'page_url as pageUrl')
    .where('auth_id', authId)

  return notifications
}

export async function addUserNotification(
  authId: string,
  message: string,
  pageUrl: string
): Promise<void> {
  await db('notifications').insert({
    auth_id: authId,
    message,
    page_url: pageUrl,
  })
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  await db('notifications').delete().where('id', notificationId)

}
