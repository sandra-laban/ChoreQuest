import { DateTime } from 'luxon'
import { AssignedChore, Chore, ChoreData } from '../../../models/chores'
import connection from '../connection'
import db from '../connection'
import { fetchFamilyId, getUserId, isAvailable, isParent } from './helper.ts'

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

export async function fetchFamilyChorelist(authId: string): Promise<Chore[]> {
  const familyId = await fetchFamilyId(authId)
  const chorelist = await db('chores')
    .join('chore_list', 'chores.id', 'chore_list.chores_id')
    .join('users', 'users.id', 'chore_list.user_id')
    .where('chores.family_id', familyId.family_id)
    .where('is_completed', false)
    .select('chores_id', 'users.name')
  return chorelist
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
  const addedChore = authorised
    ? await db('chores').insert(newChore).returning('*')
    : null

  return addedChore ? addedChore[0] : null
}

export async function acceptChore(
  authId: string,
  choreId: number
): Promise<AssignedChore | null> {
  const available = await isAvailable(authId)
  const userId = await getUserId(authId)

  const assignedChore = {
    chores_id: choreId,
    user_id: userId.id,
    assigned: DateTime.now(),
  }
  const acceptedChore = available
    ? await db('chore_list').insert(assignedChore).returning('*')
    : null
  return acceptedChore ? acceptedChore[0] : null
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
