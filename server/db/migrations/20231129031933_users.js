export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary
    table.number('family_id')
    table.string('auth_id')
    table.string('name')
    table.string('user_type')
    table.number('current_points')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('users')
}
