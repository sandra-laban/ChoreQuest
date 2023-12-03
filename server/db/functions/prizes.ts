import { Prizes } from '../../../models/prizes'
import db from '../connection'

// All Prizes by Family
export async function getAllPrizes(family: number): Promise<Prizes[]> {
  const prizes = await db('prizes')
    .where('family_id', family)
    .select([
      'id',
      'name',
      'family_id as familyId',
      'definition',
      'price',
      'quantity',
    ])
  return prizes
}

// export async function getAllPrizes(family: number): Promise<Prizes[]> {
//   const prizes = await db('prizes')
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

//   return prizes
// }

export async function addPrize(newPrize: Prizes): Promise<Prizes> {
  const [prize] = await db('prizes')
    .insert({ ...newPrize })
    .returning('*')
  return prize
}
