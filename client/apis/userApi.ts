import request from 'superagent'
import { UserForm } from '../../models/Iforms'
import { CompleteUser, User } from '../../models/Iusers'

const usersUrl = '/api/v1/users'
export async function getAllUsers(): Promise<User[]> {
  const response = await request.get(`${usersUrl}`)
  return response.body
}

export async function getUser(token: string): Promise<CompleteUser> {
  console.log('api', token)
  const response = await request
    .get(`${usersUrl}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await request.delete(`${usersUrl}/${userId}`)
  return response.body
}

export async function completeProfile(
  authRes: string,
  newUser: UserForm
): Promise<User> {
  const localUser = {
    auth_id: authRes,
    name: newUser.username,
    picture: newUser.picture,
  }
  console.log(localUser)
  const finalUser = await request.post('/api/v1/users').send(localUser)

  return finalUser.body
}

export async function updateProfile(
  authRes: string,
  newUser: UserForm
): Promise<User> {
  const updatedUser = {
    auth_id: authRes,
    name: newUser.username,
    picture: newUser.picture,
  }
  console.log(updatedUser)
  const finalUser = await request.patch('/api/v1/users').send(updatedUser)

  return finalUser.body
}
