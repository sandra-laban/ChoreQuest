import { UpdateUserForm, UserForm } from '../../../models/Iforms'
import { CompleteUser, User } from '../../../models/Iusers'
import connection from './../connection'

const db = connection

export async function fetchUser(authid: string): Promise<CompleteUser> {
  const user = await db('users').where('auth_id', authid).select('*').first()
  if (user) {
    if (user.family_id !== null) {
      const family = await db('family')
        .where('id', user.family_id)
        .select('*')
        .first()
      user.family = family
    }
  }

  console.log('db', user)
  return user
}

export async function removeUser(authId: string, userId: number): Promise<any> {
  const authority = await db('users')
    .where('auth_id', authId)
    .select('is_parent')
    .first()
  const deletedUser = authority.is_parent
    ? await db('users').where('id', userId).del()
    : false
  console.log('deletedUser', deletedUser)
  return deletedUser
}

export async function addUser(newUser: UserForm): Promise<User[]> {
  const [user] = await db('users').insert(newUser).returning('*')

  return user
}

export async function updateUser(
  authId: string,
  updatedUser: UpdateUserForm
): Promise<User[]> {
  const user = await db('users')
    .where('auth_id', updatedUser.auth_id)
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
  const authority = await db('users')
    .where('auth_id', authId)
    .select('is_parent')
    .first()

  const newParent = authority.is_parent
    ? await db('users').where('id', childId).update({
        is_parent: true,
      })
    : false
  console.log('newParent', newParent)
  return newParent
}
