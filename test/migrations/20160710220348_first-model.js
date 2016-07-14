// @flow

import typeof {Knex} from '../../knex'

export const up = (knex: Knex) =>
  knex.schema.createTable('users', table => {
    table.increments()
    table.text('email')
    table.text('password_hash')
    table.timestamps()
  })

export const down = (knex: Knex) =>
  knex.schema.dropTableIfExists('users')
