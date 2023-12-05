export async function up(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary
    table.integer('user_id').references('users.id')
    table.string('message')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('notifications')
}
