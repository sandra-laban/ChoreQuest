export async function up(knex) {
  return knex.schema.createTable('jobs', (table) => {
    table.increments('id').primary
    table.date('assigned')
    table.boolean('completed').defaultsTo('FALSE')
    table.date('due')
    table.string('name')
    table.integer('points')
    table.integer('user_id')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('jobs')
}
