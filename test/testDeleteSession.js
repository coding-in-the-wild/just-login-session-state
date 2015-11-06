var test = require('tape')
var init = require('./helpers/init.js')

var sessionId = "LOLThisIsAFakeSessionId"
var now = new Date().getTime().toString()

test('deleteSession works as expected', function(t) {
	var initialState = init()
	var ss = initialState.sessionState
	var sdb = initialState.sessionsDb

	t.plan(9)

	ss.deleteSession(sessionId, function (err) { //not yet authenticated
		t.ifError(err)

		sdb.put(sessionId, now, function (err) { //authenticate
			t.ifError(err)

			sdb.get(sessionId, function (err, time) { //make sure 'put' worked
				t.ifError(err)
				t.equal(time, now, 'times match')

				ss.deleteSession(sessionId, function (err) { //previously authenticated
					t.ifError(err)
					t.notOk(err && err.notFound, 'no \'not found\' error')

					sdb.get(sessionId, function (err, time) { //make sure unauth worked
						t.ok(err, 'error')
						t.ok(err && err.notFound, '\'not found\' error')
						t.notOk(time, 'no time came back')
						t.end()
					})
				})
			})
		})
	})
})
