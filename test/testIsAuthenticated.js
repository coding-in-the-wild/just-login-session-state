var test = require('tape')
var spaces = require('level-spaces')
var JustLoginCore = require('../index.js')
var Levelup = require('level-mem')

var fakeId = "LOLThisIsAFakeSessionId"
var fakeAddress = "example@example.com"

function init(core) {
	var db = new Levelup()
	JustLoginSessionState(core, db)
	return spaces(db, 'session')
}

test('isAuthenticated works as expected', function(t) {
	var jlc = JustLoginCore(new Levelup(), jlcOpts)
	var db = init(jlc)

	t.plan(6)

	jlc.isAuthenticated(fakeId, function(err, value) {
		t.notOk(err, 'no error')
		t.notOk(value, 'not in db')

		db.put(fakeId, fakeAddress, function (err) {
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
