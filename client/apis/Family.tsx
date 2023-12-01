import request from 'superagent'
import { FamilyFormData } from '@models/family'

export const createFamily = async (
  familyFormData: FamilyFormData,
  accessToken: any
) => {
  try {
    const { name, password, image } = familyFormData

    const formData = new FormData()
    formData.append('name', name)
    formData.append('password', password)

    if (image && image !== null) {
      formData.append('image', image)
    }

    const response = await request
      .post('/api/v1/family/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(formData)

    return response.body
  } catch (error) {
    console.error('Error creating family:', error)
    throw error
  }
}

export async function joinFamily(
  familyFormData: FamilyFormData,
  accessToken: any
) {
  try {
    const response = await request
      .patch('/api/v1/family/join')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ familyFormData })
    return response.body
  } catch (error) {
    console.error('Error fetching club members:', error)
    throw error
  }
}
