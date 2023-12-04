import connection from './../connection'

const db = connection

export async function isParent(authId: string): Promise<boolean> {
  const authority = await db('users')
    .where('auth_id', authId)
    .select('is_parent')
    .first()

  return authority.is_parent
}

export async function fetchFamilyId(auth_id: string) {
  const familyId = await db('users')
    .where('auth_id', auth_id)
    .select('family_id')
    .first()
  return familyId
}

export async function isAvailable(auth_id: string) {
  const userId = await db('users')
    .where('auth_id', auth_id)
    .select('id')
    .first()
  const availability = await db('chorelist').where('id', userId.id)
}
