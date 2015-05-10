var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

var fakeId = "LOLThisIsAFakeSessionId"
var fakeAddress = "example@example.com"

test('isAuthenticated works as expected', function(t) {
	var jlc = JustLoginCore(new Levelup()) //, jlcOpts)
	var sdb = init(jlc)
	console.log(jlc)

	t.plan(6)

	jlc.isAuthenticated(fakeId, function(err, value) {
		t.notOk(err, 'no error')
		t.notOk(value, 'not in db')

		sdb.put(fakeId, fakeAddress, function (err) {
			t.notOk(err, "no error")

			jlc.isAuthenticated(fakeId, function(err, value) {
				t.notOk(err, 'no error')
				t.ok(value, 'got a value')
				t.equal(value, fakeAddress, 'got back correct value')
				t.end()
			})
		})
	})
})
