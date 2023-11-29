export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('jobs').del()
  await knex('jobs').insert([
    {
      id: 1,
      assigned: '2023-11-28',
      completed: null,
      due: '2023-11-30',
      name: 'Wash dishes',
      points: 10,
      user_id: 1,
    },
    {
      id: 2,
      assigned: '2023-11-28',
      completed: null,
      due: '2023-11-30',
      name: 'Fold clothes',
      points: 10,
      user_id: 2,
    },
  ])
}
