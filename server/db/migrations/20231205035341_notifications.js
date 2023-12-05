export async function up(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary
    table.string('auth_id')
    table.string('message')
    table.string('page_url')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('notifications')
}
