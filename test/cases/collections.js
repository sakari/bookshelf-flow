// @flow
//

import test from 'ava'
import User from '../models/user'
import Session from '../models/session'

async function createUsers(n: number, email?: string) {
  const users = []
  if (!email)
    email = `${n}@example.com`
  while(n-- > 0) {
   users.push(await new User({email: email}).save())
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

test('query builder', async t => {
  const users = await createUsers(10, 'querybuilder@example.com')
  users.reverse()
  const result = await User.collection().query(qb => {
    qb.where('id', '<', users[2].get('id'))
    qb.where({email: 'querybuilder@example.com'})
    qb.limit(3)
    qb.orderBy('id', 'desc')
    if (false) {
      // $fails
      qb.where('nonexisting', '<', 1)
      // $fails
      qb.where({nonexisting: 1})
      // $fails
      qb.orderBy('nonexisting', 'desc')
    }
  }).fetch()

  t.true(result.length === 3)
  t.deepEqual(users.slice(3, 6).map(m => m.get('id')), result.map(m => m.get('id')))

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
