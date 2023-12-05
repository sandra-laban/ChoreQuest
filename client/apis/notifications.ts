import request from 'superagent'

export async function getNotifications(token: string): Promise<any[]> {
  const response = await request
    .get(`/api/v1/notifications`)
    .set('Authorization', `Bearer ${token}`)
  return response.body.notifications
}
