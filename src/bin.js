// @flow

import commandLineArgs from 'command-line-args'
import {fetchTable, createModel} from './print'
import fs from 'fs'

const optionSpec = [
  { name: 'connection', alias: 'c', type: String },
  { name: 'out', alias: 'o', type: String },
  { name: 'tables', alias: 't', type: String },
  { name: 'bookshelf', alias: 'b', type: String },
  { name: 'model', alias: 'm', type: String, defaultValue: 'bookshelf-flow/bookshelf' }
]

const options : {
  connection: string,
  out: string,
  tables: string,
  bookshelf: string,
  model: string
} = commandLineArgs(optionSpec)

Promise.all(options.tables.split(',').map(table => fetchTable(options.connection, table.trim() )))
  .then(tables =>
    Promise.all(tables.map(t =>
      new Promise((ok, fail) => {
        const model = createModel(options.bookshelf, options.model, t, tables)
        fs.writeFile(`${options.out}/${t.name.replace(/s$/, '')}.js`, model, err => {
          if (err) return fail(err)
          ok()
        })
      })
    ))
  )

