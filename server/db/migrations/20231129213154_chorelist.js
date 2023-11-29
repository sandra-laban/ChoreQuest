export async function up(knex) {
  return knex.schema.createTable('chorelist', (table) => {
    table.integer('chores_id')
    table.integer('users_id')
    table.date('due')
    table.date('assigned')
    table.boolean('complete').defaultsTo(null)
    // table.foreign('id').references('users.family_id').onDelete('cascade')
    // table.foreign('id').references('jobs.family_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('chorelist')
}
