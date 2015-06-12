var test = require('tape')
var init = require('./helpers/init.js')

test('session creation and continuation', function(t) {
	t.plan(5)
	var ss = init(400, 100).sessionState

	ss.createSession(function (err, sid1) {
		t.notOk(err, err ? err.message : 'successful session creation')
		setTimeout(function () {
			ss.sessionExists(sid1, function (err, createdAt) {
				t.notOk(err, err ? err.message : 'successful session continuation')
				t.ok(createdAt, 'session ID is ok')
				setTimeout(function () {
					ss.sessionExists(sid1, function (err, createdAt) {
						t.notOk(err, 'no error')
						t.notOk(createdAt, 'unsuccessful, session id expired')
						t.end()
					})
				}, 520)
			})
		}, 300)
	})
})
