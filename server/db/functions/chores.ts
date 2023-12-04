import { Chore, ChoreData } from '../../../models/chores'
import connection from '../connection'
import db from '../connection'
import { fetchFamilyId, isParent } from './helper.ts'

export function getAllChores() {
  return db('chores').select('*')
}

export async function fetchFamilyChores(authId: string): Promise<Chore[]> {
  const familyId = await fetchFamilyId(authId)
  const chores = await db('chores')
    .where('family_id', familyId.family_id)
    .select('*')
  return chores
}

export async function addChore(
  authId: string,
  chore: ChoreData
): Promise<Chore | null> {
  const familyId = await fetchFamilyId(authId)
  const authorised = await isParent(authId)

  const newChore = {
    ...chore,
    points: Number(chore.points),
    family_id: familyId.family_id,
  }
  console.log('newChore', newChore)
  const addedChore = authorised
    ? await db('chores').insert(newChore).returning('*')
    : null

  return addedChore ? addedChore[0] : null
}

export async function acceptChore(
  authId: string,
  chore: ChoreData
): Promise<Chore | null> {
  const familyId = await fetchFamilyId(authId)
  const authorised = await isParent(authId)

  const newChore = {
    ...chore,
    points: Number(chore.points),
    family_id: familyId.family_id,
  }
  console.log('newChore', newChore)
  const addedChore = authorised
    ? await db('chores').insert(newChore).returning('*')
    : null

  return addedChore ? addedChore[0] : null
}

export async function deleteChore(authId: string, choreId: number) {
  const familyId = await fetchFamilyId(authId)
  const authorised = await isParent(authId)

  const deletedChore = authorised
    ? await db('chores')
        .where('family_id', familyId.family_id)
        .where('id', choreId)
        .del()
    : null
  return deletedChore
}
