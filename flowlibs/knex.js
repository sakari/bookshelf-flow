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

declare module 'knex' {
  declare class Knex {
    static schema: Schema;
  }
  declare var exports : {
    (): Knex;
    Knex: Class<Knex>;
  }
}
