import request from 'superagent'
import { FamilyFormData } from '../models/family'

export async function createFamily(familyFormData: FamilyFormData) {
  try {
    const response = await request.get('/api/v1/family').send(familyFormData)

    return response.body
  } catch (error) {
    console.error('Error fetching club members:', error)
    throw error
  }
}
