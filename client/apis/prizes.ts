import request from 'superagent'
import { PrizeData, Prizes } from '../../models/prizes'

const serverUrl = '/api/v1/prizes'
// GET '/api/v1/prizes'
export async function getAllPrizes(token: string): Promise<Prizes[]> {
  const response = await request
    .get(`${serverUrl}`)
    .set('Authorization', `Bearer ${token}`)
  console.log('api', response.body)
  return response.body.prizes
}

export async function addPrize(newPrize: PrizeData): Promise<Prizes> {
  const response = await request.post('/api/v1/prizes').send(newPrize)
  return response.body.prizes
}
