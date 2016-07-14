// @flow

import knex from 'knex'

interface Chainable {
  index(name?: string): Chainable;
  references(column: string): Chainable;
  inTable(table: string): Chainable;
}

interface Table {
  integer(name: string): Chainable;
  increments(name?: string): Chainable;
  text(name: string, length?: number): Chainable;
  timestamps(): Chainable;
}

interface Schema {
  createTable(table: string, fn: (table: Table) => mixed): Promise<mixed>;
  dropTable(table: string): Promise<mixed>;
  dropTableIfExists(table: string): Promise<mixed>;
}

export class Knex {
  static schema: Schema;
}


const knexFlow : (() => Knex)  = knex
export default knexFlow

