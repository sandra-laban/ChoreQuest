import { Prizes } from '../../../models/prizes'
import db from '../connection'

export async function getAllPrizes(): Promise<Prizes[]> {
  const prizes = await db('prizes').select('*')
  // .join('users', 'users.family_id', 'prizes.family_id')
  // .select(
  //   'prizes.id as prizeId',
  //   'prizes.name as prizeName',
  //   'prizes.price as price',
  //   'prizes.quantity as quantity',
  //   'family_id',
  //   'users.name as userName'
  // )
  // .join('family', 'family.id', 'prizes.family_id')
  // .leftJoin('family', 'family.id', 'prizes.family_id')
  // .leftJoin('users', 'users.family_id', 'prizes.family_id')
  // .select('prizes.id as prizeId', 'prizes.name as prizeName', 'prizes.price as price', 'prizes.quantity as quantity','family.id as familyId')
  return prizes
  // .where('family_id', familyId)
}

export async function addPrize(newPrize: Prizes): Promise<Prizes> {
  const [prize] = await db('prizes')
    .insert({ ...newPrize })
    .returning('*')
  return prize
}
