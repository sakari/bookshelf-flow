// @flow
//

import test from 'ava'
import User from '../models/user'
import Session from '../models/session'

test('reladed checks argument type', async t => {
  const user = await new User().save()
  await new Session({user_id: user.get('id')})
  const session = await Session
    .where({user_id: user.get('id')})
    .fetch({withRelated: ['user']})

  if (session) {
    // ok
    session.related('user')

    // $fails
    session.related('nonexisting')
    //
    // ok
    user.related('session')

    // $fails
    user.related('nonexisting')
  }
})

// withrelated ends un in runtime error
test.failing('withRelated takes only actual relations', async t => {
  // $fails
  Session.fetch({withRelated: ['nonexisting']})

  // ok
  Session.fetch({withRelated: ['user']})

  // $fails
  User.fetch({withRelated: ['nonexisting']})

  // ok
  User.fetch({withRelated: ['session']})
})
