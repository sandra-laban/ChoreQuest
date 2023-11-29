export async function up(knex) {
  return knex.schema.createTable('chore_list', (table) => {
    table.integer('chores_id')
    table.integer('user_id')
    table.date('due')
    table.date('assigned')
    table.boolean('is_completed').defaultsTo(null)
    // table.foreign('id').references('users.family_id').onDelete('cascade')
    // table.foreign('id').references('jobs.family_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('chore_list')
}
