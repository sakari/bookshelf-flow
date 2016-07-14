// @flow

import typeof {Knex} from '../../knex'

export const up = (knex: Knex) =>
  knex.schema.createTable('sessions', table => {
    table.increments()
    table.integer('user_id').references('id').inTable('users')
  })

export const down = (knex: Knex) =>
  knex.schema.dropTableIfExists('sessions')
