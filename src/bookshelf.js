// @flow
import bs from 'bookshelf'

type Bookshelf = {
  Model: {
    extend: () => any
  }
}

const any : any = undefined

export class FlowFetchedCollection<Model> {
  length: number;
  head(): ?Model { return any }
  map<A>(fn: (model: Model, index: number) => A): Array<A> { return any }
}

type QueryOperator = '<' | '>' | '<=' | '>=' | '<>' | '='
export class QueryBuilder<Fields> {
  where(q: ($Shape<Fields> | $Enum<Fields>), op?: QueryOperator, value?: (number | string)) {}
  limit(limit: number) {}
  orderBy(field: $Enum<Fields>, direction: ('desc' | 'asc')) {}
}

export class FlowCollection<Fields, Get, Related, WithRelated> {
  constructor() {
    throw new Error('do these plse')
  }
  query(q: ({ where?: $Shape<Fields>} | (qb: QueryBuilder<Fields>) => mixed)): this { return any }
  fetch(): Promise<FlowFetchedCollection<FlowModel<Fields, Get, Related, WithRelated>>> { return any }
}

// do *not* create instances of this class
// this is used only for providing an importable type for
// generated models
export class FlowModel<Fields, Get, Related, WithRelated> {
  constructor(args: $Shape<Fields>): void {
    throw new Error('do not create instances of this class')
  }
  static where(query: $Shape<Fields>): Class<this> { return any }
  static fetch(opts?: { withRelated: (WithRelated | Array<WithRelated>)}): Promise<?this> { return any}
  get: Get;
  set(fields: $Shape<Fields>): this { return this }
  save(a: void): Promise<this> { return any }
  related: Related;
  static collection(): FlowCollection<Fields, Get, Related, WithRelated> { return any }
}

const bookshelf : (() => Bookshelf) = bs
export default bookshelf
