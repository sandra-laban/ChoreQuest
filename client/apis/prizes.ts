import request from 'superagent'
import { PrizeData, Prizes } from '../../models/prizes'

const serverUrl = '/api/v1/prizes'

export async function getAllPrizes(): Promise<Prizes[]> {
  const response = await request.get(`${serverUrl}`)
  return response.body
}

export async function addPrize(newPrize: PrizeData): Promise<Prizes> {
  const response = await request.post('/api/v1/prizes').send(newPrize)
  return response.body.prizes
}
