var test = require('tape')
var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var init = require('./helpers/init.js')

var timeoutMs = 200
var checkIntervalMs = 50
var testWindowMs = 75 //must be larger than checkIntervalMs
var fakeSecretToken = 'hahalolthisisnotverysecretivenow'
var fakeSessionId = 'whatever'
var fakeContactAddress = 'example@example.com'

function dumbTokenGen() {
	return fakeSecretToken
}

test('session expiration', function (t) {
	var jlc = JustLoginCore(new Levelup())
	var sdb = init(jlc, {
		sessionUnauthenticatedAfterMsInactivity: timeoutMs,
		sessionTimeoutCheckIntervalMs: checkIntervalMs
	})

	jlc.beginAuthentication(fakeSessionId, fakeContactAddress, function (err, credentials) {
		t.notOk(err, "no error in beginAuth()")
		t.ok(credentials, 'credentials came back')
		t.ok(credentials && credentials.token, '"credentials" has "token"')
		t.ok(credentials && credentials.contactAddress, '"credentials" has "contactAddress"')
		t.equal(credentials.contactAddress, fakeContactAddress, "contact addresses are identical")
		jlc.authenticate(credentials.token, function (err0, credentials0) {
			t.notOk(err0, "no error in beginAuth()")
			t.notOk(err0 && err0.notFound, "no 'not found' error in authenticate()")
			t.ok(credentials0, "credentials come back in authenticate()")
			t.equal(credentials0 && credentials0.contactAddress, fakeContactAddress, "credentials are correct in authenticate()")
		})
	})

	setTimeout(function () {
		sdb.get(fakeSessionId, function (err1, address1) {
			t.notOk(err1, "no error in 1st db.get()")
			t.notOk(err1 && err1.notFound, "no 'not found' error in 1st db.get()")
			t.ok(address1, "address come back in 1st db.get()")
			t.equal(address1, fakeContactAddress, "address are correct in 1st db.get()")
		})
	}, timeoutMs - testWindowMs)

	setTimeout(function () {
		sdb.get(fakeSecretToken, function (err2, address2) {
			t.ok(err2, "error in 2nd db.get()")
			t.ok(err2 && err2.notFound, "'not found' error in 2nd db.get()")
			t.notOk(address2, "credentials don't come back in 2nd db.get()")
			t.notEqual(address2, fakeContactAddress, "address is correct in 2nd db.get()")

			t.end()
		})
	}, timeoutMs + testWindowMs)
})
