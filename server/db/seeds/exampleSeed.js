import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.TOBY_AUTH_ID)

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

      await seedNotifications(trx)
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
  await trx('family').insert([
    {
      name: 'Hayward',
      password: 'password',
      picture: '/images/familyIcons/4.png',
    },
    {
      name: 'Hind',
      password: 'password',
      picture: '/images/familyIcons/3.png',
    },
  ])
}

async function seedPrizes(trx) {
  // Deletes ALL existing entries
  await trx('prizes').del()
  await trx('prizes').insert([
    {
      family_id: 1,
      name: 'Ice Cream',
      definition: '1 double scoop from the ice cream store',
      price: 800,
      quantity: 1,
    },
    {
      family_id: 1,
      name: 'Movie of your choice',
      definition: 'Any movie that we can stream at home',
      price: 100,
      quantity: 1,
    },
    {
      family_id: 2,
      name: 'Ice Cream',
      definition: '1 double scoop from the ice cream store',
      price: 800,
      quantity: 1,
    },
    {
      family_id: 2,
      name: 'Movie of your choice',
      definition: 'Any movie that we can stream at home',
      price: 100,
      quantity: 1,
    },
    {
      family_id: 3,
      name: 'Ice Cream',
      definition: '1 double scoop from the ice cream store',
      price: 800,
      quantity: 1,
    },
    {
      family_id: 3,
      name: 'Movie of your choice',
      definition: 'Any movie that we can stream at home',
      price: 100,
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
      picture: '/images/avatars/avatar-1.png',
    },
    {
      name: 'Toby',
      is_parent: true,
      family_id: 1,
      auth_id: 'auth0|656e8ad0b3f48a3f1d32e77d',
      points: null,
      picture: '/images/avatars/avatar-2.png',
    },
    {
      name: 'Gideon',
      is_parent: false,
      family_id: 1,
      auth_id: '222',
      points: 200,
      picture: '/images/avatars/avatar-3.png',
    },
    {
      name: 'Ruby',
      is_parent: false,
      family_id: 1,
      auth_id: '333',
      points: 0,
      picture: '/images/avatars/avatar-4.png',
    },
    {
      name: 'Maresa',
      is_parent: true,
      family_id: 2,
      auth_id: 'auth0|112',
      points: null,
    },
    {
      name: 'Peter',
      is_parent: true,
      family_id: 2,
      auth_id: 'auth0|111',
      points: null,
    },
    {
      name: 'Teddy',
      is_parent: false,
      family_id: 2,
      auth_id: 'auth0|113',
      points: null,
    },
    {
      name: 'Otis',
      is_parent: false,
      family_id: 2,
      auth_id: 'auth0|114',
      points: null,
    },
    {
      name: 'Rudy',
      is_parent: false,
      family_id: 2,
      auth_id: 'auth0|115',
      points: null,
    },
    {
      name: 'Remy',
      is_parent: false,
      family_id: 2,
      auth_id: 'auth0|116',
      points: null,
    },
  ])
}

async function seedNotifications(trx) {
  await trx('notifications').del()
  await trx('notifications').insert([
    {
      auth_id: 'auth0|656e8ad0b3f48a3f1d32e77d',
      message: 'Chore has been added',
    },
  ])
}
