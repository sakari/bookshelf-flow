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

The binary and library uses written using flow (duh) and all kinds of nice
new javascript candy so running it it likely more nice with `babel-node` with a
`.babelrc` containing

```
{
  "presets": ['es2015', 'stage-0'],
  "plugins": ['transform-class-properties', 'syntax-flow', 'transform-flow-strip-types']
}
```

## Testing

Create psql database with

    createdb bookshelf-flow

then run

    npm test
