import request from 'superagent'
import { Prizes } from '../../models/prizes'

const serverUrl = '/api/v1/prizes'
export async function getAllPrizes(): Promise<Prizes[]> {
  const response = await request.get(`${serverUrl}`)
  return response.body
}
