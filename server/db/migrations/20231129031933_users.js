export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary
    table.integer('family_id')
    table.string('auth_id')
    table.string('name')
    table.string('user_type')
    table.integer('current_points')
    table.foreign('id').references('jobs.user_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('users')
}
