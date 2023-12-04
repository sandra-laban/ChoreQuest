import { Prizes } from '../../../models/prizes'
import db from '../connection'
import { fetchFamilyId } from './family'

export async function getAllPrizes(auth_id: string): Promise<Prizes[]> {
  const familyId = await fetchFamilyId(auth_id)
  // const familyId = await db('users')
  //   .where('auth_id', auth_id)
  //   .select('family_id')
  //   .first()
  const prizes = await db('prizes')
    .where({ family_id: familyId.family_id })
    .select('*')
  // .join('users', 'users.family_id', 'prizes.family_id')
  // .select(
  //   'prizes.id',
  //   'prizes.name as prizeName',
  //   'price',
  //   'quantity',
  //   'family_id',
  //   'users.auth_id'
  // )
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
  console.log('DB HERE')
  console.log(prizes)
  return prizes
}

export async function addPrize(newPrize: Prizes): Promise<Prizes> {
  const [prize] = await db('prizes')
    .insert({ ...newPrize })
    .returning('*')
  return prize
}
