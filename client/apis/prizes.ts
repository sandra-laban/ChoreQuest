import request from 'superagent'
import { PrizeData, Prizes } from '../../models/prizes'

const serverUrl = '/api/v1/prizes'
// GET '/api/v1/prizes/:familyId
export async function getAllPrizes(familyId: number): Promise<Prizes[]> {
  const response = await request.get(`${serverUrl}/${familyId}`)
  return response.body
}

export async function addPrize(newPrize: PrizeData): Promise<Prizes> {
  const response = await request.post('/api/v1/prizes').send(newPrize)
  return response.body.prizes
}
