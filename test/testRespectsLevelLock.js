var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var lock = require('level-lock')
var init = require('./helpers/init.js')

test('isAuthenticated respects level-lock locks', function(t) {
	var jlc = JustLoginCore(new Levelup()) //, jlcOpts)
	var sdb = init(jlc)

	t.plan(7)

	jlc.isAuthenticated('token1', function (err, val) {
		t.notOk(err, 'first auth has no err' + (err && err.message))
		t.notOk(val, 'unauthenticated')

		var unlock = lock(sdb, 'token2', 'rw')
		t.ok(unlock, 'lock aquired')
		jlc.isAuthenticated('token2', function (err, val) {
			t.ok(err, 'an error happened when locked ' + (err && err.message))
			t.notOk(val, 'unauthenticated')

			unlock && unlock()
			jlc.isAuthenticated('token2', function (err, val) {
				t.notOk(err, 'no error after lock given up ' + (err && err.message))
				t.notOk(val, 'unauthenticated')

				t.end()
			})
		})
	})

	t.end()
})


test('unauthenticate respects level-lock locks', function(t) {
	var jlc = JustLoginCore(new Levelup()) //, jlcOpts)
	var sdb = init(jlc)

	t.plan(4)

	jlc.unauthenticate('token1', function (err) {
		t.notOk(err, 'first auth has no err' + (err && err.message))

		var unlock = lock(sdb, 'token2', 'rw')
		t.ok(unlock, 'lock aquired')
		jlc.unauthenticate('token2', function (err) {
			t.ok(err, 'an error happened when locked ' + (err && err.message))

			unlock && unlock()
			jlc.unauthenticate('token2', function (err) {
				t.notOk(err, 'no error after lock given up ' + (err && err.message))

				t.end()
			})
		})
	})

	t.end()
})
