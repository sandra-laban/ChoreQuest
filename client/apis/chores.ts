import request from 'superagent'
import { Chore } from '../../models/chores.ts'

export async function getAllChores(): Promise<Chore[]> {
  const response = await request.get('/api/v1/chores')
  return response.body
}
