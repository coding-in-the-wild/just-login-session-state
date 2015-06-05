var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

var sessionId = 'LOLThisIsAFakeSessionId'
var now = new Date

test('sessionExists works as expected', function(t) {
	var jlc = JustLoginCore(new Levelup())
	var sdb = init(jlc, false)

	t.plan(6)

	jlc.sessionExists(sessionId, function(err, value) {
		t.notOk(err, 'no error')
		t.notOk(value, 'not in db')

		sdb.put(sessionId, String(now.getTime()), function (err) {
			t.notOk(err, 'no error')

			jlc.sessionExists(sessionId, function(err, value) {
				t.notOk(err, 'no error')
				t.ok(value, 'got a value')
				t.deepEqual(value, now, 'got back correct value')
				t.end()
			})
		})
	})
})
