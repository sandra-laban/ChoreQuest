export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { id: 1, family_id: 1, auth_id: 'auth0|123', name: 'Peter' },
  ])
}
