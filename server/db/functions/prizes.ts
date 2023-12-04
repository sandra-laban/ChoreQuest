import { Prizes, PrizeData } from '../../../models/prizes'
import db from '../connection'
import { fetchFamilyId } from './helper'
import { isParent } from './helper'

export async function getAllPrizes(auth_id: string): Promise<Prizes[]> {
  const familyId = await fetchFamilyId(auth_id)
  const prizes = await db('prizes')
    .where({ family_id: familyId.family_id })
    .select('*')
  return prizes
}

// export async function fetchParent(auth_id: string) {
//   const parent = await db('users')
//     .where('auth_id', auth_id)
//     .select('isParent')
//     .first()
//   return parent
// }

export async function addPrize(
  auth_id: string,
  newPrize: PrizeData
): Promise<Prizes | null> {
  const familyId = await fetchFamilyId(auth_id)
  const authorised = await isParent(auth_id)
  const prize = authorised
    ? await db('prizes')
        .insert({ ...newPrize, family_id: familyId.family_id })
        .returning('*')
    : null
  return prize ? prize[0] : null
}
