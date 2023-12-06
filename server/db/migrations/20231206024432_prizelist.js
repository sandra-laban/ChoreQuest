import { DateTime } from 'luxon'

export async function up(knex) {
  return knex.schema.createTable('prize_list', (table) => {
    table.integer('prizes_id')
    table.integer('user_id')
    table.date('assigned').defaultsTo(DateTime.now().toISODate())
    table.boolean('delivered').defaultsTo(false)
  })
}

export async function down(knex) {
  return knex.schema.dropTable('prize_list')
}
