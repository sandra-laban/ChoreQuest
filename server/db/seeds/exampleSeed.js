export async function seed(knex) {
  try {
    await knex.transaction(async (trx) => {
      // Seed tables without foreign key constraints
      await seedFamily(trx)

      // Seed tables with foreign key constraints
      await seedChores(trx)
      await seedUsers(trx)
      await seedPrizes(trx)

      // Seed tables with foreign key constraints that depend on other seeded tables
      await seedChoreList(trx)
    })
  } catch (error) {
    console.error('Error during seed:', error)
    throw error
  }
}

async function seedChores(trx) {
  await trx('chores').del()
  await trx('chores').insert([
    { name: 'Do the dishes', points: 100, family_id: 1, created: new Date() },
  ])
}

async function seedChoreList(trx) {
  await trx('chore_list').del()

  const assignedDate = new Date()
  const dueDate = new Date(assignedDate)
  dueDate.setDate(assignedDate.getDate() + 2)

  await trx('chore_list').insert([
    {
      chores_id: 1,
      user_id: 3,
      assigned: assignedDate,
      is_completed: false,
      due: dueDate,
    },
  ])
}

async function seedFamily(trx) {
  await trx('family').del()
  await trx('family').insert([{ name: 'Hayward', password: 'password' }])
}

async function seedPrizes(trx) {
  // Deletes ALL existing entries
  await trx('prizes').del()
  await trx('prizes').insert([
    {
      family_id: 1,
      name: 'Ice Cream',
      definition: '1 double scoope from the ice cream store',
      price: 800,
      quantity: 1,
    },
  ])
}

async function seedUsers(trx) {
  await trx('users').del()
  await trx('users').insert([
    {
      name: 'Riley',
      is_parent: true,
      family_id: 1,
      auth_id: '111',
      points: null,
    },
    {
      name: 'Gideon',
      is_parent: false,
      family_id: 1,
      auth_id: '222',
      points: 200,
    },
    {
      name: 'Ruby',
      is_parent: true,
      family_id: null,
      auth_id: '333',
      points: 0,
    },
  ])
}
