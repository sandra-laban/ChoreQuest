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
    .leftJoin('chore_list', 'chores.id', 'chore_list.chores_id')
    .where('family_id', familyId.family_id)
    .select('chores.*', { is_completed: 'chore_list.is_completed' })
    .where((builder) => {
      builder
        .whereNull('chore_list.is_completed')
        .orWhere('chore_list.is_completed', false)
    })
  return chores
}

export async function fetchFamilyChorelist(authId: string): Promise<Chore[]> {
  const familyId = await fetchFamilyId(authId)
  const chorelist = await db('chores')
    .join('chore_list', 'chores.id', 'chore_list.chores_id')
    .join('users', 'users.id', 'chore_list.user_id')
    .where('chores.family_id', familyId.family_id)
    .where('is_completed', false)

    .select('chores_id', 'users.name', 'is_completed')

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

  const trx = await db.transaction()
  try {
    if (!authorised) return null

    await trx('chore_list').where('chores_id', choreId).del()

    const deletedChore = await trx('chores')
      .where('family_id', familyId.family_id)
      .where('id', choreId)
      .del()

    trx.commit()
    return deletedChore
  } catch (err) {
    trx.rollback()
    throw err
  }
}

export async function finishChore(authId: string, choreId: number) {
  const userId = await getUserId(authId)
  const completedChore = await db('chore_list')
    .where('chores_id', choreId)
    .where('user_id', userId.id)
    .update({
      is_completed: true,
    })
  await getPoints(authId, choreId)
  return completedChore
}

async function getPoints(authId: string, choreId: number) {
  const userId = await getUserId(authId)
  const points = await db('chores')
    .where('id', choreId)
    .select('points')
    .first()
  const userPoints = await db('users')
    .where('id', userId.id)
    .increment('points', points.points)

  return userPoints
}
