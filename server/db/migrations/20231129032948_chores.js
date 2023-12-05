export async function up(knex) {
  return knex.schema.createTable('chores', (table) => {
    table.increments('id').primary
    table.string('name')
    table.integer('points')
    // TODO: change created to due - will need to trace up through code
    table.date('created')
    table.integer('family_id')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('chores')
}
