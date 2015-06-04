var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

test('session creation and continuation', function(t) {
	t.plan(5)
	var jlc = JustLoginCore(new Levelup())
	var sdb = init(jlc, {
		sessionUnauthenticatedAfterMsInactivity: 100,
		sessionTimeoutCheckIntervalMs: 10
	})

	jlc.createSession(function (err, sid1) {
		t.notOk(err, err ? err.message : 'successful session creation')
		setTimeout(function () {
			jlc.isAuthenticated(sid1, function (err, address1) {
				t.notOk(err, err ? err.message : 'successful session continuation')
				t.ok(address1, 'session ID is ok')
				setTimeout(function () {
					jlc.isAuthenticated(sid1, function (err, address2) {
						t.notOk(err, 'no error')
						t.notOk(address2, 'unsuccessful, session id expired')
						t.end()
					})
				}, 120)
			})
		}, 80)
	})
})
