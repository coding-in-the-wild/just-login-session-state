var test = require('tape')
var init = require('./helpers/init.js')

test('unauthenticating a session id that does not exist is ok', function (t) {
	t.plan(1)

	init().sessionState.unauthenticate('DOES NOT EXIST', function (err) {
		t.ifError(err)
		t.end()
	})
})

test('unauthenticate() does not delete the current session', function(t) {
	var sessionId = 'whatever'
	var contactAddress = 'person@email.com'
	var now = new Date().getTime().toString()

	var initialState = init()
	var ss = initialState.sessionState
	var asdb = initialState.authedSessionsDb
	var sdb = initialState.sessionsDb

	t.plan(7)

	sdb.put(sessionId, now, function (err) {
		t.ifError(err)

		asdb.put(sessionId, contactAddress, function (err) { //authenticate
			t.ifError(err)

			ss.unauthenticate(sessionId, function (err) { //previously authenticated
				t.ifError(err)

				asdb.get(sessionId, function (err, address) {
					t.ok(err && err.notFound, '\'not found\' error')
					t.notOk(address)

					sdb.get(sessionId, function (err, time) { // session should stay around
						t.ifError(err)
						t.equal(time, now)

						t.end()
					})
				})
			})
		})
	})
})
