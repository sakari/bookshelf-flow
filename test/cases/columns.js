// @flow

import test from 'ava'
import User from '../models/user'

test('User can be created', async t => {
  const now = new Date()
  const user = await new User({email: 'a@example.com', password_hash: 'deadbeef'})
    .save()
  t.true(Number.isInteger(user.get('id')))
  t.is(user.get('email'), 'a@example.com')
  t.is(user.get('password_hash'), 'deadbeef')
  t.true(now <= user.get('created_at'))
  t.true(now <= user.get('updated_at'))
  t.pass()
})

test('User cannot be passed extra fields', t => {
  // $fails
  new User({foo: 1})
})

test('User cannot get non exsting fields', t => {
  const user = new User()
  // $fails
  const p = user.get('foo')

  // ok
  user.get('email')
})

test('User cannot be set to non existing field', t => {
  const user = new User()
  // $fails
  user.set({foo: 1})
})

test('User field cannot be set to incorrect type',  t => {
  const user = new User()
  // $fails
  user.set({email: 1})

  // ok
  user.set({email: 'abc'})
})
