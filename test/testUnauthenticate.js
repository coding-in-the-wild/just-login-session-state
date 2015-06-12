var test = require('tape')
var init = require('./helpers/init.js')

var fakeSessionId = "LOLThisIsAFakeSessionId"
var now = String(new Date().getTime())

test('unauthenticate works as expected', function(t) {
	var initialState = init()
	var ss = initialState.sessionState
	var asdb = initialState.authedSessionsDb

	t.plan(9)

	ss.unauthenticate(fakeSessionId, function (err) { //not yet authenticated
		t.notOk(err, 'no error')

		asdb.put(fakeSessionId, now, function (err) { //authenticate
			t.notOk(err, 'no error')

			asdb.get(fakeSessionId, function (err, time) { //make sure 'put' worked
				t.notOk(err, 'no error')
				t.equal(time, now, 'times match')

				ss.unauthenticate(fakeSessionId, function (err) { //previously authenticated
					t.notOk(err, 'no error')
					t.notOk(err && err.notFound, 'no "not found" error')

					asdb.get(fakeSessionId, function (err, time) { //make sure unauth worked
						t.ok(err, 'error')
						t.ok(err && err.notFound, '"not found" error')
						t.notOk(time, 'no time came back, DONE')
						t.end()
					})
				})
			})
		})
	})
})
