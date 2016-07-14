// @flow
import childProcess from 'child_process'
import _ from 'lodash'

type Index = { type: 'primary_key' }
  | { type: 'reference', inTable: string, otherColumn: string }
  | { type: 'foreign', inTable: string, otherColumn: string, thisColumn: string }

type Column = {
  name: string,
  type: string,
  modifiers: { notNull?: boolean },
  indexes: Array<Index>
}

type Table = {
  columns: Array<Column>,
  name: string
}

function parseModifiers(ms: string) {
  return {
    notNull: /not null/.test(ms)
  }
}

function parseColumn(column: string): Column {
  const [name, type, modifierList] = column.split('|').map(c => c.trim())
  const modifiers = parseModifiers(modifierList)
  return  { name, type, modifiers, indexes: [] }
}

function mapColumn(columns, columnName, fn) {
  return columns.map(column => {
    if (column.name === columnName) {
      return fn(column)
    }
    return column
  })
}

function parseIndex(columns: Array<Column>, index: string): Array<Column> {
  const m = index.match(/PRIMARY KEY, btree \(([^\)]+)\)/)
  if (m) {
    const matchedName = m[1]
    if (matchedName) {
      return mapColumn(columns, matchedName, column =>
        ({
          ...column,
          indexes: column.indexes.concat({
            type: 'primary_key'
          })
        }))
    }
  }
  return columns
}

function parseForeignKey(columns, line) {
  const m = line.match(/FOREIGN KEY \(([^)]+)\) REFERENCES ([^( ]+)\(([^)]+)\)/)
  if (m) {
    const [match, localColumn, inTable, otherColumn] = m
    if (localColumn && inTable && otherColumn) {
      return mapColumn(columns, localColumn, column =>
        ({
          ...column,
          indexes: [...column.indexes, {
            type: 'foreign',
            inTable,
            otherColumn,
            thisColumn: localColumn
          }]
        })
      )
    }
  }
  console.log('no match to foreign key', line)
  return columns
}
function parseReferences(columns, line) {
  const m = line.match(/TABLE "([^)]+)" CONSTRAINT "[^"]+" FOREIGN KEY \(([^)]+)\)/)
  if (m) {
    const [match, inTable, otherColumn] = m
    if (inTable && otherColumn) {
      return mapColumn(columns, 'id', column =>
        ({
          ...column,
          indexes: [...column.indexes, {
            type: 'reference',
            inTable,
            otherColumn
          }]
        })
      )
    }
  }
  console.log('no match to reference', line)
  return columns
}

function parseTable(table: string): Array<Column> {
  return table
    .split('\n')
    .reduce((memo, line) => {
      if (memo.state === null && /^---/.test(line))
        return { ...memo, state: 'columns' }
      if (/^Indexes:/.test(line))
        return { ...memo, state: 'indexes' }
      if (/^Foreign-key constraints:/.test(line))
        return { ...memo, state: 'foreign' }
      if (/^Referenced by:/.test(line))
        return { ...memo, state: 'references' }

      if (memo.state === 'references' ) {
        return { ...memo, columns: parseReferences(memo.columns, line) }
      }
      if (memo.state === 'foreign') {
        return { ...memo, columns: parseForeignKey(memo.columns, line) }
      }
      if (memo.state === 'columns') {
        return { ...memo, columns: memo.columns.concat(parseColumn(line)) }
      }
      if (memo.state === 'indexes') {
        return { ...memo, columns: parseIndex(memo.columns, line) }
      }
      return memo
    }, { state: null, columns: []}).columns
}

export function fetchTable(url: string, table: string) {
  return new Promise((ok, fail) => {
    const cmd = `psql ${url} -c '\\d ${table}'`
    childProcess.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr)
        return fail(new Error(`command ${cmd} failed`))
      }
      try {
        ok({ columns: parseTable(stdout.toString('utf-8')), name: table })
      } catch (e) {
        fail(e)
      }
    })
  })
}

function mapSqlTypeToFlow(type) {
  const map = {
    integer: 'number',
    text: 'string',
    'timestamp with time zone': 'Date'
  }
  const got = map[type]
  if (!got) {
    throw new Error(`Unknown sql type ${type}`)
  }
  return got
}

function createGetType({columns}) {
  return columns.map(column => `((column: '${column.name}') => ${mapSqlTypeToFlow(column.type)})`).join(' & ')
}

function relations(table) {
  return _.flatten(table.columns.map(column => column.indexes.filter(i => ['reference', 'foreign'].indexOf(i.type) >= 0)))
}

function relationName(tableName) {
  return tableName.replace(/s$/, '')
}

function modelName(tableName) {
  return _.upperFirst(_.camelCase(tableName.replace(/s$/, '')))
}

function moduleName(tableName) {
  return tableName.replace(/s$/, '')
}

function relationAttributes(table) {
  return relations(table).reduce((relations, relation) => {
    if (relation.type === 'foreign')
      return { ...relations, [relationName(relation.inTable)]: `function() { return this.belongsTo(${modelName(relation.inTable)}, '${relation.thisColumn}') }` }
    if (relation.type === 'reference')
      return { ...relations, [relationName(relation.inTable)]: `function() { return this.hasMany(${modelName(relation.inTable)}, '${relation.otherColumn}') }` }
  }, {})
}

function importRelationModels(table) {
  return relations(table).map(foreign => {
    return `import ${modelName(foreign.inTable)} from './${moduleName(foreign.inTable)}'`
  }, {}).join('\n')
}

function createRelatedType(table) {
  if (relations(table).length === 0) {
    return 'void'
  }
  return relations(table).map(foreign => {
    return `((table: '${moduleName(foreign.inTable)}') => ${modelName(foreign.inTable)})`
  }).join('\n  &')
}

export function createModel(bookshelf: string, table: Table, tables: Array<Table>) {
  const fields = table.columns.map(column => `${column.name}: ${mapSqlTypeToFlow(column.type)}`).join(',\n  ')
  const get = createGetType(table)
  const attrs = {
    ...(relationAttributes(table)),
    tableName: `'${table.name}'`,
    hasTimestamps: table.columns.some(column => column.name === 'created_at')? 'true' : 'false'
  }
  const importModels = importRelationModels(table)
  const related = createRelatedType(table)
  const withRelatedType = relations(table).length > 0 ?
    relations(table).map(f => `'${moduleName(f.inTable)}'`).join(' | ') : 'void'
  const str = `// @flow
// Autogenerated from psql definition

import type {FlowModel} from 'bookshelf-flow-model'
import bookshelf from '${bookshelf}'
${importModels}

type GetType = ${get}
type RelatedType = ${related}
type WithRelatedType = ${withRelatedType}
type FieldType = {
  ${fields}
}

const model : Class<FlowModel<$Supertype<FieldType>, GetType, RelatedType, WithRelatedType>> = bookshelf.Model.extend({
  ${_.map(attrs, (value, key) => `${key}: ${value}`).join(',\n  ')}
})
export default model
  `
  return str
}
