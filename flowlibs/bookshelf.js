type Bookshelf = {
  Model: {
    extend: () => any
  }
}
declare module 'bookshelf' {
  declare var exports : {
    (): Bookshelf
  }
}
