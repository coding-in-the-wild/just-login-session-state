var test = require('tape')
var init = require('./helpers/init.js')

test('session creation and continuation', function(t) {
	t.plan(5)
	var ss = init(Infinity, 400).sessionState

	ss.createSession(function (err, sessionId) {
		t.ifError(err)

		setTimeout(function () {
			ss.sessionExists(sessionId, function (err, createdAt) {
				t.ifError(err)
				t.ok(createdAt, 'session ID is ok')

				setTimeout(function () {
					ss.sessionExists(sessionId, function (err, createdAt) {
						t.ifError(err)
						t.notOk(createdAt, 'unsuccessful, session id expired')

						t.end()
					})
				}, 520)
			})
		}, 300)
	})
})
