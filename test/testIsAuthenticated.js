var test = require('tape')
var init = require('./helpers/init.js')

var fakeId = 'LOLThisIsAFakeSessionId'
var fakeAddress = 'example@example.com'

test('isAuthenticated works as expected', function(t) {
	var initialState = init()
	var ss = initialState.sessionState
	var asdb = initialState.authedSessionsDb

	t.plan(6)

	ss.isAuthenticated(fakeId, function(err, value) {
		t.notOk(err, 'no error')
		t.notOk(value, 'not in db')

		asdb.put(fakeId, fakeAddress, function (err) {
			t.notOk(err, 'no error')

			ss.isAuthenticated(fakeId, function(err, value) {
				t.notOk(err, 'no error')
				t.ok(value, 'got a value')
				t.equal(value, fakeAddress, 'got back correct value')
				t.end()
			})
		})
	})
})
