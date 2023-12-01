export async function up(knex) {
  return knex.schema.createTable('prizes', (table) => {
    table.increments('id').primary
    table.string('name')
    table.integer('family_id')
    table.string('definition')
    table.integer('price')
    table.integer('quantity')
    // table.foreign('id').references('users.family_id').onDelete('cascade')
    // table.foreign('id').references('chores.family_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('prizes')
}
