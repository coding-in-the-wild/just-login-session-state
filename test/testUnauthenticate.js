var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

var fakeSessionId = "LOLThisIsAFakeSessionId"
var fakeEmail = "example@example.com"

test('unauthenticate works as expected', function(t) {
	var jlc = JustLoginCore(new Levelup())
	var sdb = init(jlc)

	t.plan(11)

	jlc.unauthenticate(fakeSessionId, function (err) { //not yet authenticated
		t.notOk(err, 'no error')
		t.equal(typeof err, 'null', 'error is null')

		sdb.put(fakeSessionId, fakeEmail, function (err) { //authenticate
			t.notOk(err, 'no error')

			sdb.get(fakeSessionId, function (err, email) { //make sure 'put' worked
				t.notOk(err, 'no error')
				t.equal(email, fakeEmail, 'emails match')

				jlc.unauthenticate(fakeSessionId, function (err) { //previously authenticated
					t.notOk(err, 'no error')
					t.notOk(err && err.notFound, 'no "not found" error')
					t.equal(typeof err, 'null', 'error is null')

					sdb.get(fakeSessionId, function (err, email) { //make sure unauth worked
						t.ok(err, 'error')
						t.ok(err && err.notFound, '"not found" error')
						t.notOk(email, 'no email came back')
						t.end()
					})
				})
			})
		})
	})
})
