import { DateTime } from 'luxon'
import { AssignedChore, Chore, ChoreData } from '../../../models/chores'
import db from '../connection'
import {
  fetchFamilyId,
  getUserId,
  getUserIdFromName,
  isAvailable,
  isParent,
} from './helper.ts'

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

  await db('notifications')
    .delete()
    .where('auth_id', authId)
    .where('page_url', '/chores')

  return chores
}

export async function fetchFamilyRecents(authId: string): Promise<Chore[]> {
  const familyId = await fetchFamilyId(authId)
  console.log(familyId)
  const chores = await db('chores')
    .join('chore_list', 'chores.id', 'chore_list.chores_id')
    .where('family_id', familyId.family_id)
    .where('is_completed', true)
    .where('reviewed', false)

  console.log(chores)
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
  }
  const acceptedChore = available
    ? await db('chore_list').insert(assignedChore).returning('*')
    : null
  return acceptedChore ? acceptedChore[0] : null
}

export async function unassignChore(authId: string, choreId: number) {
  const authorised = await isParent(authId)

  const unassignedChore = authorised
    ? await db('chore_list').where('chores_id', choreId).del()
    : false

  return unassignedChore
}

export async function assignChore(
  authId: string,
  choreId: number,
  kid: string
) {
  const authorised = await isParent(authId)
  const family_id = await fetchFamilyId(authId)
  const kidId = await getUserIdFromName(kid, family_id.family_id)
  const assignChore = {
    chores_id: choreId,
    user_id: kidId.id,
  }

  if (!authorised) return null
  await db('chore_list').insert(assignChore)
  const [chore] = await db('chores').select('name').where('id', choreId)

  const [user] = await db('users').select('name', 'id').where('id', kidId.id)

  return { chore, user }
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
  const user = await getUserId(authId)
  const completedChoreId = await db('chore_list')
    .where('chores_id', choreId)
    .where('user_id', user.id)
    .update({
      is_completed: true,
      completed: Number(DateTime.now().toFormat('yyyyMMddHHmmss')),
    })
  if (!completedChoreId) return null

  const userName = await db('users').select('name').where('id', user.id).first()
  user.name = userName.name

  const [chore] = await db('chores')
    .select('name', 'points')
    .where('id', choreId)

  return { chore, user }
}

export async function rejectChore(authId: string, choreId: number) {
  const authorisation = await isParent(authId)

  if (!authorisation) return null

  const kidId = await db('chore_list')
    .where('chores_id', choreId)
    .select('user_id')
    .first()

  await db('chore_list')
    .where('user_id', kidId.user_id)
    .whereNot('chores_id', choreId)
    .whereNot('is_completed', true)
    .del()

  await db('chore_list').where('chores_id', choreId).update({
    is_completed: false,
    completed: null,
  })

  const [chore] = await db('chores').select('name').where('id', choreId)
  const [user] = await db('users')
    .select('name', 'id')
    .where('id', kidId.user_id)

  return { chore, user }
}

export async function confirmChore(authId: string, choreId: number) {
  const authorisation = await isParent(authId)

  if (!authorisation) return null

  const kidId = await db('chore_list')
    .where('chores_id', choreId)
    .select('user_id')
    .first()

  await db('chore_list').where('chores_id', choreId).update({
    reviewed: true,
  })

  const [chore] = await db('chores')
    .select('name', 'points')
    .where('id', choreId)
  const [user] = await db('users')
    .select('name', 'id')
    .where('id', kidId.user_id)

  await getPoints(kidId.user_id, choreId)
  return { chore, user }
}

async function getPoints(userId: string, choreId: number) {
  const points = await db('chores')
    .where('id', choreId)
    .select('points')
    .first()
  const userPoints = await db('users')
    .where('id', userId)
    .increment('points', points.points)

  return userPoints
}
