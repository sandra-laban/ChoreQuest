import db from '../connection'
import { FamilyFormData } from '@models/family'
import fs from 'fs'
import path from 'path'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fetchFamilyId, generateUniqueUsername, usernameCheck } from './helper'

export async function createFamily(
  familyData: FamilyFormData,
  image: File | null | any,
  auth_id: string
) {
  const allowedExtensions = ['.png']

  const trx = await db.transaction()

  let pictureUrl = null
  try {
    try {
      const fileExtension = path.extname(image.originalname).toLowerCase()
      if (image) {
        if (allowedExtensions.includes(fileExtension)) {
          const folderPath = './public/images/familyIcons'
          await fs.promises.mkdir(folderPath, { recursive: true })

          const uniqueFilename = `${uuidv4()}${extname(image.originalname)}`
          pictureUrl = uniqueFilename

          const filePath = `${folderPath}/${uniqueFilename}`

          await fs.promises.writeFile(filePath, image.buffer)
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }

    const [familyId] = await trx('family').insert({
      ...familyData,
      picture: pictureUrl,
    })
    if (!familyId) {
      throw new Error('Could not create your family')
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

    trx.commit()
    return { success: true, message: 'Successfully created a family' }
  } catch (error) {
    await trx.rollback()
    console.error('Error creating family:', error)
    throw error
  }
}

export async function joinFamily(familyData: FamilyFormData, auth_id: string) {
  const trx = await db.transaction()
  try {
    const [family] = await trx('family').where({
      name: familyData.name,
      password: familyData.password,
    })

    if (!family) {
      throw new Error('Could not find your family')
    }

    const joinedFamily = await trx('users')
      .where({ auth_id })
      .update({ family_id: family.id, is_parent: false })

    if (joinedFamily !== 1) {
      throw new Error('Failed to update user record')
    }

    trx.commit()
    usernameCheck(auth_id, family.id)
    return { success: true, message: 'Successfully joined the family' }
  } catch (error) {
    await trx.rollback()
    console.error('Error creating family:', error)
    throw error
  }
}

export async function fetchFamily(auth_id: string) {
  const familyId = await fetchFamilyId(auth_id)
  const family = await db('family')
    .where({ id: familyId.family_id })
    .select('*')
    .first()

  return family
}

export async function fetchFamilyMembers(auth_id: string) {
  const familyId = await fetchFamilyId(auth_id)

  console.log(familyId)

  const family = await db('users')
    .leftJoin('prizes', 'prizes.id', 'users.goal')
    .leftJoin(
      db.raw(
        '(SELECT * FROM chore_list WHERE chore_list.is_completed IS NULL OR chore_list.is_completed = false) AS cl'
      ),
      'users.id',
      '=',
      'cl.user_id'
    )
    .leftJoin('chores', 'cl.chores_id', 'chores.id')
    .where('users.family_id', familyId.family_id)
    .select(
      'users.*',
      db.raw('coalesce(prizes.name, "None") as goal_name'),
      db.raw('coalesce(chores.name, "None") as chore_name')
    )

  console.log(family)
  return family
}
