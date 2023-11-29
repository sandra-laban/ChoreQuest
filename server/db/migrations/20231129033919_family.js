export async function up(knex) {
  return knex.schema.createTable('family', (table) => {
    table.increments('id').primary
    table.string('name')
    table.password('password')
    table.foreign('id').references('users.family_id').onDelete('cascade')
    table.foreign('id').refernces('jobs.family_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('family')
}
