var test = require('tape')
var init = require('./helpers/init.js')
var aae = require('./helpers/assertAsyncError.js')

test('isAuthenticated() throws asynchronously if no callback is supplied', function (t) {
	t.plan(2)

	var isAuthed = init().sessionState.isAuthenticated
	aae(isAuthed, [ 'session id' ], function (asyncErr, syncErr) {
		t.ok(asyncErr)
		t.notOk(syncErr)
		t.end()
	})
})

test('isAuthenticated() throws asynchronously if no callback and a bad session id are supplied', function (t) {
	t.plan(2)

	var isAuthed = init().sessionState.isAuthenticated
	aae(isAuthed, [ null ], function (asyncErr, syncErr) {
		t.ok(asyncErr)
		t.notOk(syncErr)
		t.end()
	})
})

test('isAuthenticated() calls back with a decent error message if a bad session id is passed', function (t) {
	t.plan(2)

	init().sessionState.isAuthenticated(null, function (err) {
		t.ok(err)
		t.ok(/session ?id/i.test(err.message))
		t.end()
	})
})

test('isAuthenticated() works as expected', function(t) {

	var sessionId = 'LOLThisIsAFakeSessionId'
	var contactAddress = 'example@example.com'

	var initialState = init()
	var ss = initialState.sessionState
	var asdb = initialState.authedSessionsDb

	ss.isAuthenticated(sessionId, function(err, addr) {
		t.ifError(err)
		t.notOk(addr, 'not in db')

		asdb.put(sessionId, contactAddress, function (err) {
			t.ifError(err)

			ss.isAuthenticated(sessionId, function(err, addr) {
				t.ifError(err)
				t.equal(addr, contactAddress, 'got back correct value')

				t.end()
			})
		})
	})
})
