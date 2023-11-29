export async function up(knex) {
  return knex.schema.createTable('jobs', (table) => {
    table.increments('id').primary
    table.date('assigned')
    table.boolean('completed')
    table.date('due')
    table.number('points')
    table.number('user_id')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('jobs')
}
