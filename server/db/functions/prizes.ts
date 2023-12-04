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

export async function editPrize(
  prizes_id: number,
  editPrize: PrizeData
): Promise<Prizes[]> {
  const prize = await db('prizes')
    .where('id', prizes_id)
    .update({
      ...editPrize,
    })
    .returning('*')
  return prize
}

export async function deletePrize(auth_id: string, prize_id: number) {
  const authorised = await isParent(auth_id)
  const deletePrize = authorised
    ? await db('prizes').where('id', prize_id).delete()
    : null
  return deletePrize
}
