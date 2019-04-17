const test = require('tape')
const { 'api-users': users } = require('.')

//
// Create a mock request and response method
//

function status (code) {
  this.statusCode = code
  return this
}

function send (obj) {
  const body = { ...this, ...obj }
  return body
}

function set (value) {
  this[value] = value
  return this
}

const res = {
  status,
  send,
  set
}

const username = `test-user`
const email = `test-user@gmail.com`

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - POST new user', async t => {
  const req = {
    method: 'POST',
    body: {
      email,
      username
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.equals(data, 'OK')
  t.end()
})

test('fail - POST new user, missing username', async t => {
  const req = {
    method: 'POST',
    body: {
      email
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Username required.`)
  t.end()
})

test('fail - POST new user, missing email address', async t => {
  const req = {
    method: 'POST',
    body: {
      username
    }
  }

  const { err, data, statusCode } = await users(req, res)

  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Email address required.`)
  t.end()
})

test('fail - POST new user, invalid email address', async t => {
  const req = {
    method: 'POST',
    body: {
      email: 'not@n-email',
      username
    }
  }

  const { err, data, statusCode } = await users(req, res)

  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Your email address, not@n-email, is invalid.`)
  t.end()
})

test('pass - GET user by ID', async t => {
  const req = {
    method: 'GET',
    query: {
      id: username
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(!err)
  t.ok(data)

  const valid = {
    username,
    email
  }

  delete data.ctime

  t.equals(statusCode, 200)
  t.deepEqual(data, valid)
  t.end()
})

test('fail - GET user by ID', async t => {
  const req = {
    method: 'GET',
    query: {
      id: 'xxx'
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, 'Unable to find the document for xxx.')
  t.end()
})

test('pass - POST update user', async t => {
  const req = {
    method: 'POST',
    body: {
      username,
      email: 'baz@bar.com',
      update: true
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.equals(data, 'OK')
  t.end()
})

test('pass - GET user by ID, verify update', async t => {
  const req = {
    method: 'GET',
    query: {
      id: username
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(!err)
  t.ok(data)

  const valid = {
    username,
    email: 'baz@bar.com'
  }

  delete data.ctime

  t.equals(statusCode, 200)
  t.deepEqual(data, valid)
  t.end()
})

test('fail - POST update user, username already exists', async t => {
  const req = {
    method: 'POST',
    body: {
      email: 'baz@bar.com',
      username,
      update: false
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Username, ${username}, already exists.`)
  t.end()
})

test('pass - DELETE user by username', async t => {
  const req = {
    method: 'DELETE',
    query: {
      username
    }
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.deepEqual(data, 'OK')
  t.end()
})

test('fail - DELETE user by username, no username', async t => {
  const req = {
    method: 'DELETE',
    query: {}
  }

  const { err, data, statusCode } = await users(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, 'Username is empty.')
  t.end()
})
