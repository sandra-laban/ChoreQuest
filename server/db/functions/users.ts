import { UpdateUserForm, UserForm } from '../../../models/Iforms'
import { CompleteUser, User } from '../../../models/Iusers'
import connection from './../connection'
import { isParent } from './helper'

const db = connection

export async function fetchUser(authid: string): Promise<CompleteUser> {
  const user = await db('users').where('auth_id', authid).select('*').first()
  const currentChore = await db('users')
    .join('chore_list', 'users.id', 'chore_list.user_id')
    .join('chores', 'chores.id', 'chore_list.chores_id')
    .where('auth_id', authid)
    .where('is_completed', false)
    .select('chore_list.chores_id', 'chores.name')
    .first()
  console.log('chore', currentChore)
  if (user) {
    if (user.family_id !== null) {
      const family = await db('family')
        .where('id', user.family_id)
        .select('*')
        .first()
      user.family = family
    }
    if (currentChore) {
      user.currentChore = currentChore
    }
  }

  console.log('db', user)
  return user
}

export async function removeUser(authId: string, userId: number): Promise<any> {
  const authorised = await isParent(authId)
  const deletedUser = authorised
    ? await db('users').where('id', userId).del()
    : false
  console.log('deletedUser', deletedUser)
  return deletedUser
}

export async function addUser(newUser: UserForm): Promise<User[]> {
  // const existingUser = await db('users').where('name', newUser.username)
  // if (existingUser) {
  //   const newUsername = await generateUniqueUsername(newUser.username)
  //   newUser.username = newUsername
  // }
  const [user] = await db('users').insert(newUser).returning('*')

  return user
}

async function generateUniqueUsername(baseUsername: string) {
  let suffix = 2
  let newUsername = baseUsername

  while (await db('users').where('username', newUsername).first()) {
    suffix++
    newUsername = `${baseUsername}${suffix}`
  }

  return newUsername
}

export async function updateUser(
  authId: string,
  updatedUser: UpdateUserForm
): Promise<User[]> {
  console.log('db', updatedUser)
  const user = await db('users')
    .where('auth_id', authId)
    .update({
      name: updatedUser.username,
      picture: updatedUser.picture,
    })
    .returning('*')

  return user
}

export async function createParent(
  authId: string,
  childId: number
): Promise<any> {
  const authorised = await isParent(authId)

  const newParent = authorised
    ? await db('users').where('id', childId).update({
        is_parent: true,
      })
    : false
  console.log('newParent', newParent)
  return newParent
}
