var test = require('tape')
var init = require('./helpers/init.js')

var sessionId = 'LOLThisIsAFakeSessionId'
var now = new Date

test('sessionExists works as expected', function(t) {
	var initialState = init()
	var ss = initialState.sessionState
	var sdb = initialState.sessionsDb

	t.plan(6)

	ss.sessionExists(sessionId, function(err, value) {
		t.notOk(err, 'no error')
		t.notOk(value, 'not in db')

		sdb.put(sessionId, String(now.getTime()), function (err) {
			t.notOk(err, 'no error')

			ss.sessionExists(sessionId, function(err, value) {
				t.notOk(err, 'no error')
				t.ok(value, 'got a value')
				t.deepEqual(value, now, 'got back correct value')
				t.end()
			})
		})
	})
})
