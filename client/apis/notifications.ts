import request from 'superagent'

export async function getNotifications(token: string): Promise<any[]> {
  const response = await request
    .get(`/api/v1/notifications`)
    .set('Authorization', `Bearer ${token}`)
  return response.body.notifications
}

export async function deleteNotification(
  token: string,
  notification_id: string
): Promise<any[]> {
  const response = await request
    .delete(`/api/v1/notifications`)
    .set('Authorization', `Bearer ${token}`)
    .send({ notification_id })
  return response.body.notifications
}
