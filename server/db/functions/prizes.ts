import { Prizes, PrizeData } from '../../../models/prizes'
import db from '../connection'
import { fetchFamilyId, getUserId, isParent } from './helper'

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
  const addPrize = {
    ...newPrize,
    price: Number(newPrize.price),
    quantity: Number(newPrize.quantity),
    family_id: familyId.family_id,
  }
  const prize = authorised
    ? await db('prizes').insert(addPrize).returning('*')
    : null
  console.log(prize)
  return prize ? prize[0] : null
}

export async function getPrize(prizeId: number): Promise<Prizes> {
  const prize = await db('prizes').where('id', prizeId).select('*').first()
  return prize
}

export async function editPrize(
  authId: string,
  prizesId: number,
  editPrize: PrizeData
): Promise<Prizes[] | null> {
  const authorised = await isParent(authId)
  const editedPrize = {
    ...editPrize,
    id: Number(prizesId),
    price: Number(editPrize.price),
    quantity: Number(editPrize.quantity),
  }
  const prize = authorised
    ? await db('prizes')
        .where('id', prizesId)
        .update({
          ...editedPrize,
        })
        .returning('*')
    : null
  return prize ? prize[0] : null
}

export async function claimPrize(authId: string, prizesId: number) {
  const userId = await getUserId(authId)

  const userPoints = await db('users')
    .where('auth_id', authId)
    .select('points')
    .first()

  const prizeCost = await db('prizes')
    .where('id', prizesId)
    .select('price')
    .first()

  const affordable = userPoints.points >= prizeCost.price

  if (!affordable) return null

  const claimedPrize = {
    prizes_id: prizesId,
    user_id: userId.id,
  }

  const trx = await db.transaction()

  const claimed = await trx('prize_list').insert(claimedPrize)
  await trx('prizes').where('id', prizesId).decrement('quantity', 1)

  trx.commit()
  await qtyCheck(prizesId)

  return claimed
}

export async function deletePrize(auth_id: string, prize_id: number) {
  const authorised = await isParent(auth_id)
  const deletePrize = authorised
    ? await db('prizes').where('id', prize_id).delete()
    : null
  return deletePrize
}

export async function qtyCheck(prizeId: number) {
  const qty = await db('prizes').where('id', prizeId).select('quantity').first()

  qty < 1 ? await db('prizes').where('id', prizeId).del() : null
}
