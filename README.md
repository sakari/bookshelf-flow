# Bookshelf models with flow types

Tool to produce bookshelf models with flow annotations from postgresql tables.

    bookshelf-flow --connection <postgresql://nnn/dbname> --tables <model,tabels> --out <model/dir> --bookshelf <path/to/bookshelf/configuration/from/model/dir>

We also re-export bookshelf and knex with flow types

## Testing

Create psql database with

    createdb bookshelf-flow

then run

    npm test
