export async function up(knex) {
  return knex.schema.createTable('chores', (table) => {
    table.increments('id').primary
    table.string('name')
    table.integer('points')
    table.date('created')
    table.integer('family_id')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('chores')
}
