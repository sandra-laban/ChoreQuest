import connection from './../connection'

const db = connection

export async function getFamilyMembersById(
  user_id: string
): Promise<{ id: string }[]> {
  const [family_id] = await db('users').select('family_id').where('id', user_id)

  const familyMembers = await db('users')
    .where('family_id', family_id.family_id)
    .select('id')
  return familyMembers
}
