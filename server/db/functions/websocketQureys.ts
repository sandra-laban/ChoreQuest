import connection from './../connection'

const db = connection

export async function getFamilyMembersById(
  user_id: string,
  usersToGet: 'family' | 'parents' | number
): Promise<{ id: string; auth_id: string }[]> {
  const [user] = await db('users').select('family_id').where('id', user_id)
  let familyMembers: any
  if (usersToGet === 'family') {
    familyMembers = await db('users')
      .where('family_id', user.family_id)
      .select('id', 'auth_id')
  } else if (usersToGet === 'parents') {
    familyMembers = await db('users')
      .where('family_id', user.family_id)
      .where('is_parent', true)
      .select('id', 'auth_id')
  } else if (typeof usersToGet === 'number') {
    familyMembers = await db('users')
      .where('id', usersToGet)
      .select('id', 'auth_id')
  }
  return familyMembers
}
