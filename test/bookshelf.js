// @flow

import knex from '../src/knex'
import bookshelf from '../src/bookshelf'
import * as knexfile from './knexfile'
export default bookshelf(knex(knexfile['development']));
