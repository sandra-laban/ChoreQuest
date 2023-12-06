import { DateTime } from 'luxon'

export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.integer('family_id')
    table.string('auth_id').unique()
    table.string('name')
    table.string('picture')
    table.integer('points').defaultsTo(0)
    table.boolean('is_parent').defaultsTo(null)
  })

  await knex.schema.createTable('chores', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.integer('points')
    table.date('created')
    table.integer('family_id')
  })

  await knex.schema.createTable('family', (table) => {
    table.increments('id').primary()
    table.string('name').unique()
    table.string('password')
    table.string('picture').defaultsTo(null)
  })

  await knex.schema.createTable('chore_list', (table) => {
    table.integer('chores_id')
    table.integer('user_id')
    table.date('due')
    table.date('assigned').defaultsTo(DateTime.now().toISODate())
    table.boolean('is_completed').defaultsTo(false)
    table.date('completed')
    table.boolean('reviewed').defaultsTo(false)
  })

  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary()
    table.string('auth_id')
    table.string('message')
    table.string('page_url')
  })

  await knex.schema.createTable('prizes', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.integer('family_id')
    table.string('definition')
    table.integer('price')
    table.integer('quantity')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('chores')
  await knex.schema.dropTable('family')
  await knex.schema.dropTable('chore_list')
  await knex.schema.dropTable('notifications')
  await knex.schema.dropTable('prizes')
}
