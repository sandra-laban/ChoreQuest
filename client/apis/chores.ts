import request from 'superagent'
import type { Chore } from '../../models/chores.ts'

const choreUrl = '/api/v1/chores'

export async function getAllChores(): Promise<Chore[]> {
  const response = await request.get(choreUrl)
  return response.body
}
