export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary
    table.integer('family_id')
    table.string('auth_id')
    table.string('name')
    table.string('picture')
    // table.string('user_type')
    table.integer('points').defaultsTo(0)
    table.boolean('is_parent').defaultsTo(null)
    table.integer('goal')
    // table.foreign('id').references('jobs.user_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('users')
}
