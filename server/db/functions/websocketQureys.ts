import connection from './../connection'

const db = connection

export async function getFamilyMembersById(
  user_id: string,
  usersToGet: 'family' | 'parent' | 'user'
): Promise<{ id: string; auth_id: string }[]> {
  const [user] = await db('users').select('family_id').where('id', user_id)

  if (usersToGet === 'family') {
    const familyMembers = await db('users')
      .where('family_id', user.family_id)
      .select('id', 'auth_id')
    return familyMembers
  } else if (usersToGet === 'parent') {
    const familyMembers = await db('users')
      .where('family_id', user.family_id)
      .where('is_parent', true)
      .select('id', 'auth_id')

    return familyMembers
  } else if (usersToGet === 'user') {
    const familyMembers = await db('users')
      .where('id', user_id)
      .select('id', 'auth_id')
    return familyMembers
  }
  return []
}
