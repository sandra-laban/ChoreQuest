export async function up(knex) {
  return knex.schema.createTable('family', (table) => {
    table.increments('id').primary
    table.string('name')
    table.password('password')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('family')
}
