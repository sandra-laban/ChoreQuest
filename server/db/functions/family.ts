import db from '../connection'
import { FamilyFormData } from '@models/family'

export async function createFamily(
  familyData: FamilyFormData,
  auth_id: number
) {
  const [familyId] = await db('family').insert(familyData)

  if (!familyId) {
    throw new Error('Could not find your family')
  }

  const makeUserParent = await db('users')
    .where({ auth_id })
    .update({ is_parent: true })

  if (makeUserParent !== 1) {
    throw new Error('Failed to make user a parent')
  }

  const joinedFamily = await db('users')
    .where({ auth_id })
    .update({ family_id: familyId })

  if (joinedFamily !== 1) {
    throw new Error('Failed to update user record')
  }

  return { success: true, message: 'Successfully created a family' }
}

export async function joinFamily(familyData: FamilyFormData, auth_id: number) {
  const [family] = await db('family').where({
    name: familyData.name,
    password: familyData.password,
  })

  if (!family) {
    throw new Error('Could not find your family')
  }

  const joinedFamily = await db('users')
    .where({ auth_id })
    .update({ family_id: family.id })

  if (joinedFamily !== 1) {
    throw new Error('Failed to update user record')
  }

  return { success: true, message: 'Successfully joined the family' }
}
