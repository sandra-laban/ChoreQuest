import request from 'superagent'
import { PrizeData, Prizes } from '../../models/prizes'

const serverUrl = '/api/v1/prizes'
// GET '/api/v1/prizes'
export async function getAllPrizes(token: string): Promise<Prizes[]> {
  const response = await request
    .get(`${serverUrl}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body.prizes
}

// GET '/api/v1/prizes/:id'
export async function getPrize(
  prizeId: string,
  token: string
): Promise<Prizes> {
  console.log('prizeId ', prizeId)
  console.log('token ', token)
  const response = await request
    .get(`${serverUrl}/${prizeId}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body.prize
}

// POST '/api/v1/prizes'
export async function addPrize(
  newPrize: PrizeData,
  token: string
): Promise<Prizes> {
  const response = await request
    .post('/api/v1/prizes')
    .set('Authorization', `Bearer ${token}`)
    .send(newPrize)
  return response.body.prizes
}

// PATCH '/api/v1/prizes'
export async function patchPrize(
  patchedPrize: PrizeData,
  token: string,
  prizeId: number
): Promise<void> {
  await request
    .patch(`${serverUrl}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ prizeId, patchedPrize })
}
