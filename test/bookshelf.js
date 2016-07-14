// @flow

import knex from '../knex'
import bookshelf from '../bookshelf'
import * as knexfile from './knexfile'
export default bookshelf(knex(knexfile['development']));
