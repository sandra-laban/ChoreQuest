import connection from './../connection'

const db = connection

export async function getFamilyMembersById(
  user_id: string,
  usersToGet: 'family' | 'parent' | 'user'
): Promise<{ id: string; auth_id: string }[]> {
  if (usersToGet === 'family') {
    const [family_id] = await db('users')
      .select('family_id')
      .where('id', user_id)

    const familyMembers = await db('users')
      .where('family_id', family_id.family_id)
      .select('id', 'auth_id')

    return familyMembers
  } else if (usersToGet === 'parent') {
    const [parent_id] = await db('users')
      .select('parent_id')
      .where('id', user_id)

    const familyMembers = await db('users')
      .where('parent_id', parent_id.parent_id)
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
