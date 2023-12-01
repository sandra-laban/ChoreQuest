import { Prizes } from '../../../models/prizes'
import db from '../connection'

export async function getAllPrizes(): Promise<Prizes[]> {
  const prizes = await db('prizes').select('*')
  return prizes
  // .where('family_id', familyId)
}

export async function addPrize(newPrize: Prizes): Promise<Prizes> {
  const [prize] = await db('prizes')
    .insert({ ...newPrize })
    .returning('*')
  return prize
}
