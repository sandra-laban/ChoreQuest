import request from 'superagent'
import { Chore, ChoreData } from '../../models/chores.ts'

// export async function getAllChores(): Promise<Chore[]> {
//   const response = await request.get('/api/v1/chores')
//   return response.body
// }

export async function getFamilyChores(token: string): Promise<Chore[]> {
  const response = await request
    .get('/api/v1/chores')
    .set('Authorization', `Bearer ${token}`)
  return response.body.chores
}

export async function getFamilyChorelist(token: string): Promise<any> {
  const response = await request
    .get('/api/v1/chores/list')
    .set('Authorization', `Bearer ${token}`)
  console.log('response', response.body)
  return response.body.chores
}

export async function addChore(
  token: string,
  chore: ChoreData
): Promise<Chore> {
  const response = await request
    .post('/api/v1/chores')
    .set('Authorization', `Bearer ${token}`)
    .send({ chore })

  return response.body
}

export async function acceptChore(
  token: string,
  choreId: number
): Promise<Chore> {
  const response = await request
    .post('/api/v1/chores/accept')
    .set('Authorization', `Bearer ${token}`)
    .send({ choreId })
  console.log('api response', response.body)
  return response.body
}

export async function completeChore(
  token: string,
  choreId: number
): Promise<Chore> {
  const response = await request
    .patch('/api/v1/chores/complete')
    .set('Authorization', `Bearer ${token}`)
    .send({ choreId })
  console.log('api compplete chore response', response.body)
  return response.body
}

export async function deleteChore(
  token: string,
  choreId: number
): Promise<void> {
  const deletedChore = await request
    .delete(`/api/v1/chores`)
    .set('Authorization', `Bearer ${token}`)
    .send({ choreId })
  return deletedChore.body
}
