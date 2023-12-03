import request from 'superagent'
import { UserForm } from '../../models/Iforms'
import { CompleteUser, User } from '../../models/Iusers'

const usersUrl = '/api/v1/user'

export async function getUser(
  token: string
): Promise<{ profile?: CompleteUser; message?: string }> {
  const response = await request
    .get('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
  return response.body
}

export async function getFamilyMembers(token: string): Promise<User[]> {
  console.log('token', token)
  console.log('api familyrequest')
  const response = await request
    .get('api/v1/family')
    .set('Authorization', `Bearer ${token}`)
  return response.body.family
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
  const finalUser = await request.post('/api/v1/user').send(localUser)

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
  const finalUser = await request.patch('/api/v1/user').send(updatedUser)

  return finalUser.body
}

export async function makeParent(
  token: string,
  childId: number
): Promise<void> {
  const response = await request
    .patch('/api/v1/user/parentify')
    .set('Authorization', `Bearer ${token}`)
    .send({ childId })
  return response.body
}

export async function deleteUser(token: string, userId: number): Promise<void> {
  const response = await request
    .delete('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    .send({ userId })
  return response.body
}
