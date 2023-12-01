import { Chore, ChoreData } from '../../../models/chores'
import connection from '../connection'
import db from '../connection'

export function getAllChores() {
  return db('chores').select('*')
}

export async function addChore(chore: ChoreData): Promise<Chore> {
  return connection('chores')
    .insert(chore)
    .returning(['id', 'name', 'points', 'created'])
}

export async function deleteChore(id: number) {
  return connection('chores').where('id', id).del()
}
