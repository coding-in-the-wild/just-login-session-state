var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

test('session creation and continuation', function(t) {
	t.plan(5)
	var jlc = JustLoginCore(new Levelup())
	init(jlc, false, 400, 100)

	jlc.createSession(function (err, sid1) {
		t.notOk(err, err ? err.message : 'successful session creation')
		setTimeout(function () {
			jlc.sessionExists(sid1, function (err, createdAt) {
				t.notOk(err, err ? err.message : 'successful session continuation')
				t.ok(createdAt, 'session ID is ok')
				setTimeout(function () {
					jlc.sessionExists(sid1, function (err, createdAt) {
						t.notOk(err, 'no error')
						t.notOk(createdAt, 'unsuccessful, session id expired')
						t.end()
					})
				}, 520)
			})
		}, 300)
	})
})
