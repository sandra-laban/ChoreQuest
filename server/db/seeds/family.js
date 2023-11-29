export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('family').del()
  await knex('family').insert([
    { id: 1, name: 'Hind', password: 'password' },
    {
      id: 2,
      name: 'Laban',
      password: 'pAssword',
    },
  ])
}
