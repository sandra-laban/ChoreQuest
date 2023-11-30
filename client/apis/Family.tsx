import request from 'superagent'
import { FamilyFormData } from '@models/family'

export async function createFamily(familyFormData: FamilyFormData) {
  try {
    const userId = 111
    const response = await request
      .post('/api/v1/family/create')
      .send({ familyFormData, userId })

    return response.body
  } catch (error) {
    console.error('Error fetching club members:', error)
    throw error
  }
}

export async function joinFamily(familyFormData: FamilyFormData) {
  try {
    const userId = 333
    const response = await request
      .patch('/api/v1/family/join')
      .send({ familyFormData, userId })
    return response.body
  } catch (error) {
    console.error('Error fetching club members:', error)
    throw error
  }
}
