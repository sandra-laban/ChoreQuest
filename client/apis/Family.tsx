import request from 'superagent'
import { FamilyFormData } from '@models/family'

export const createFamily = async (familyFormData: FamilyFormData) => {
  try {
    const { name, password, image } = familyFormData
    const userId = 111

    const formData = new FormData()
    formData.append('name', name)
    formData.append('password', password)
    formData.append('userId', userId.toString())

    if (image && image !== null) {
      formData.append('image', image)
    }

    const response = await request.post('/api/v1/family/create').send(formData)

    return response.body
  } catch (error) {
    console.error('Error creating family:', error)
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
