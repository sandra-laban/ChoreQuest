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
  const userChores = await db('chore_list')
    .join('users', 'users.id', 'chore_list.user_id')
    .where('auth_id', auth_id)
    .select('is_completed')
  const available = userChores
    ? userChores.every((chore) => chore.is_completed)
    : true

  return available
}

export async function getUserId(auth_id: string) {
  const userId = await db('users')
    .where('auth_id', auth_id)
    .select('id')
    .first()
  return userId
}

export async function getUserIdFromName(name: string, familyId: number) {
  const userId = await db('users')
    .where('family_id', familyId)
    .where('name', name)
    .select('id')
    .first()
  return userId
}

export async function generateUniqueUsername(baseUsername: string) {
  let suffix = 1
  let newUsername = baseUsername

  while (await db('users').where('name', newUsername).first()) {
    suffix++
    newUsername = `${baseUsername}${suffix}`
  }
  // console.log('helper', newUsername)
  return newUsername
}

export async function usernameCheck(auth_id: string, family_id: number) {
  const username = await db('users').where({ auth_id }).select('name').first()

  const existingUser = await db('users')
    .where('family_id', family_id)
    .where('name', username.name)
    .select('*')

  if (existingUser.length > 1) {
    const newName = await generateUniqueUsername(username.name)
    // console.log('newName', newName)
    await db('users').where({ auth_id }).update({ name: newName })
  }
}
