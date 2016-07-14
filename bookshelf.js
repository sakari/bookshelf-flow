// @flow
import bs from 'bookshelf'

type Bookshelf = {
  Model: {
    extend: () => any
  }
}

const any : any = undefined

// do *not* create instances of this class
// this is used only for providing an importable type for
// generated models
export class FlowModel<Fields, Get, Related, WithRelated> {
  constructor(args: $Shape<Fields>): void {}
  static where(query: $Shape<Fields>): Class<this> { return any }
  static fetch(opts?: { withRelated: (WithRelated | Array<WithRelated>)}): Promise<?this> { return any}
  get: Get;
  set(fields: $Shape<Fields>): this { return this }
  save(a: void): Promise<this> { return any }
  related: Related;
}

const bookshelf : (() => Bookshelf) = bs
export default bookshelf
