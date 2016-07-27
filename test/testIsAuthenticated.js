var test = require('tape')
var init = require('./helpers/init.js')

test('isAuthenticated() calls back with a decent error message if a bad parameter is passed', function (t) {
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
