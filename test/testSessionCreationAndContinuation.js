var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

test('session creation and continuation', function(t) {
	t.plan(4)
	var jlc = JustLoginCore(new Levelup())
	var sdb = init(jlc, {
		sessionUnauthenticatedAfterMsInactivity: 100,
		sessionTimeoutCheckIntervalMs: 10
	})

	jlc.createSession(function (err, sid1) {
		t.notOk(err, err ? err.message : 'successful session creation')
		setTimeout(function () {
			jlc.continueSession(sid1, function (err, sid2) {
				t.notOk(err, err ? err.message : 'successful session continuation')
				setTimeout(function () {
					jlc.continueSession(sid1, function (err, sid3) {
						t.ok(err, 'unsuccessful session continuation')
						t.ok(err && err.notFound, 'due to the non-existent session id (it expired)')
						t.end()
					})
				}, 120)
			})
		}, 80)
	})
})
