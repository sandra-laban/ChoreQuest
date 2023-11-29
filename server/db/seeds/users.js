export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      family_id: 1,
      auth_id: 'auth0|123',
      name: 'Peter',
      is_parent: 'TRUE',
    },
    {
      id: 2,
      family_id: 2,
      auth_id: 'auth0|456',
      name: 'Sandra',
      is_parent: 'TRUE',
    },
    {
      id: 3,
      family_id: 1,
      auth_id: 'auth0|457',
      name: 'Maresa',
      is_parent: 'TRUE',
    },
    { id: 4, family_id: 1, auth_id: 'auth0|458', name: 'Teddy' },
    { id: 5, family_id: 1, auth_id: 'auth0|459', name: 'Otis' },
    { id: 6, family_id: 1, auth_id: 'auth0|450', name: 'Remy' },
    { id: 7, family_id: 1, auth_id: 'auth0|451', name: 'Rudy' },
  ])
}
