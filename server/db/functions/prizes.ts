import { Prizes } from '../../../models/prizes'
import db from '../connection'

export function getAllPrizes(familyId: number): Promise<Prizes[]> {
  return db('prizes')
    .select([
      'id',
      'name',
      'family_id as familyId',
      'definition',
      'price',
      'quantity',
    ])
    .where('family_id', familyId)
}
