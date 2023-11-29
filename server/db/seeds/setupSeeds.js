/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
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
    { name: 'Do the dishes', value: 100, family_id: 1, created: new Date() },
  ])
}

async function seedChoreList(trx) {
  await trx('chore_list').del()

  const assignedDate = new Date()
  const dueDate = new Date(assignedDate)
  dueDate.setDate(assignedDate.getDate() + 2)

  await trx('chore_list').insert([
    {
      jobs_id: 1,
      family_id: 1,
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
      auth_id: '23523567564324',
      points: null,
    },
    {
      name: 'Gideon',
      is_parent: false,
      family_id: 1,
      auth_id: '23523567564324324',
      points: 200,
    },
    {
      name: 'Ruby',
      is_parent: true,
      family_id: 1,
      auth_id: '235235677567524324',
      points: 0,
    },
  ])
}
