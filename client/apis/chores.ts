import request from 'superagent'
import { Chore, ChoreData } from '../../models/chores.ts'

export async function getAllChores(): Promise<Chore[]> {
  const response = await request.get('/api/v1/chores')
  return response.body
}

export async function addChore({
  name,
  points,
  created,
}: ChoreData): Promise<void> {
  const chore = { name, points, created }
  await request.post('/api/v1/chores').send({ chore })
}
