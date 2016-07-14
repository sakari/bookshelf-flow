declare module 'bookshelf-flow-model' {
  declare class FlowModel<Fields, Get, Related, WithRelated> {
    constructor(args: $Shape<Fields>): void;
    static where(query: $Shape<Fields>): Class<this>;
    static fetch(opts?: { withRelated: (WithRelated | Array<WithRelated>)}): Promise<?this>;
    get: Get;
    set(fields: $Shape<Fields>): this;
    save(a: void): Promise<this>;
    related: Related;
  }
}
