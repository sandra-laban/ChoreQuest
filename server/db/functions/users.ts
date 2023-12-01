import { UpdateUserForm, UserForm } from '../../../models/Iforms'
import { CompleteUser, User } from '../../../models/Iusers'
import connection from './../connection'

const db = connection

export async function fetchAllUsers(): Promise<User[]> {
  const users = await db('users').select('*')
  return users
}

export async function fetchUser(authid: string): Promise<CompleteUser> {
  const user = await db('users').where('auth_id', authid).select('*').first()

  console.log('db', user)
  return user
}

export async function removeUser(id: number): Promise<any> {
  const removedUser = await db('users').where('id', id).del().returning('*')
  return removedUser
}

export async function addUser(newUser: UserForm): Promise<User[]> {
  const [user] = await db('users').insert(newUser).returning('*')

  return user
}

export async function updateUser(updatedUser: UpdateUserForm): Promise<User[]> {
  const user = await db('users')
    .where('auth_id', updatedUser.auth_id)
    .update({
      name: updatedUser.username,
      picture: updatedUser.picture,
    })
    .returning('*')

  return user
}
