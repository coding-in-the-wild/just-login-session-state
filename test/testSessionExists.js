var test = require('tape')
var init = require('./helpers/init.js')

test('sessionExists() calls back with a decent error message if a bad parameter is passed', function (t) {
	t.plan(2)

	init().sessionState.sessionExists(null, function (err) {
		t.ok(err)
		t.ok(/session ?id/i.test(err.message))
		t.end()
	})
})

test('sessionExists() works as expected', function(t) {
	var sessionId = 'whatever'
	var now = new Date().getTime()

	var initialState = init()
	var ss = initialState.sessionState
	var sdb = initialState.sessionsDb

	t.plan(6)

	ss.sessionExists(sessionId, function(err, value) {
		t.ifError(err)
		t.notOk(value, 'session does not exist')

		sdb.put(sessionId, now.toString(), function (err) {
			t.ifError(err)

			ss.sessionExists(sessionId, function(err, value) {
				t.ifError(err)
				t.ok(value, 'session exists')
				t.deepEqual(value.getTime(), now, 'expected time')
				t.end()
			})
		})
	})
})
