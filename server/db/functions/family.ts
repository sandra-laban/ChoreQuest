import db from '../connection'
import { FamilyFormData } from '@models/family'
import fs from 'fs'
import path from 'path'

export async function createFamily(
  familyData: FamilyFormData,
  image: File | null | any,
  auth_id: number
) {
  const allowedExtensions = ['.png']
  const fileExtension = path.extname(image.originalname).toLowerCase()
  const trx = await db.transaction()

  try {
    const [familyId] = await trx('family').insert(familyData)

    if (!familyId) {
      throw new Error('Could not find your family')
    }

    const makeUserParent = await trx('users')
      .where({ auth_id })
      .update({ is_parent: true })

    if (makeUserParent !== 1) {
      throw new Error('Failed to make user a parent')
    }

    const joinedFamily = await trx('users')
      .where({ auth_id })
      .update({ family_id: familyId })

    if (joinedFamily !== 1) {
      throw new Error('Failed to update user record')
    }

    if (image) {
      if (allowedExtensions.includes(fileExtension)) {
        const folderPath = './public/images/familyIcons'
        await fs.promises.mkdir(folderPath, { recursive: true })

        await fs.promises.writeFile(
          path.join(folderPath, familyId + '.png'),
          image.buffer
        )
      } else {
        throw new Error('Invalid image extension')
      }
    }

    trx.commit()
    return { success: true, message: 'Successfully created a family' }
  } catch (error) {
    await trx.rollback()
    console.error('Error creating family:', error)
    throw error
  }
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
