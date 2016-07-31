// @flow
//

import test from 'ava'
import User from '../models/user'
import Session from '../models/session'

async function createUsers(n: number) {
  const users = []
  while(n-- > 0) {
   users.push(await new User({email: `${n}@example.com`}).save())
  }
  return users
}

test('collection#query and fetch returns the matching models', async t => {
  const users = await createUsers(10)
  const id = users[0].get('id')
  const found = await User.collection().query({where: {id}}).fetch()
  t.is(1, found.length)

  const first = found.head()
  if (!first)
    throw new Error('omg')
  t.is(first.get('email'), users[0].get('email'))

  // $fails
  first.get('foo')
})

test('query checks `where` parameters', async t => {
  // $fails
  await User.collection().query({where: { foo: 1 }})

  // $fails
  await User.collection().query({where: { email: 1 }})

  // ok
  await User.collection().query({where: { email: 'abc@example.com' }})
})

test('cant use lodash methods without fetching', async t => {
  // $fails
  User.collection().head()

  // $fails
  User.collection().length
})
