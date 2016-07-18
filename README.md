# Bookshelf models with flow types

Tool to produce bookshelf models with flow annotations from postgresql tables.

    bookshelf-flow  \
      --connection <postgresql://nnn/dbname> \
      --tables <table1,table2...> \
      --out <model/dir> \
      --bookshelf <import/path/to/bookshelf/configuration/from/model/dir>

See `test/cases/*.js` for examples.

This package also re-exports bookshelf and knex and provides flow types for
those. To use those definitions import the packages with

    import knex from 'bookshelf-flow/knex'
    import bookshelf from 'bookshelf-flow/bookshelf'

## Installing

The package can be installed directly from github with

    npm install sakari/bookshelf-flow

It will compile to plain javascript in the preinstall phase and set up
`.js.flow` files for the flow type checker.

## Testing

Create psql database with

    createdb bookshelf-flow

then run

    npm test
