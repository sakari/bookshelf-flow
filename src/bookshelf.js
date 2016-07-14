// @flow
import bs from 'bookshelf'

type Bookshelf = {
  Model: {
    extend: () => any
  }
}

const bookshelf : (() => Bookshelf) = bs
export default bookshelf
