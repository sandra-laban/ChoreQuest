import { Family, FamilyFormData } from '@models/family'
import request from 'superagent'

export async function getFamily(token: string): Promise<{ family?: Family }> {
  const response = await request
    .get('/api/v1/family')
    .set('Authorization', `Bearer ${token}`)
  return response.body
}
