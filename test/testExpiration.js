var test = require('tape')
var init = require('./helpers/init.js')
var authenticate = require('./helpers/authenticate.js')
var assertSession = require('./helpers/assertSession.js')

test('auto-log-out', function (t) {
	var sessionId = 'whatever'
	var contactAddress = 'example@example.com'

	var initialState = init(200, Infinity)
	var asdb = initialState.authedSessionsDb
	var jlc = initialState.core

	authenticate(t, jlc, sessionId, contactAddress)
	var assertAuthenticated = assertSession(t, asdb, sessionId, contactAddress)

	setTimeout(function () {
		assertAuthenticated(true)
	}, 180)

	setTimeout(function () {
		assertAuthenticated(false, t.end.bind(t))
	}, 300)
})

test('isAuthenticated() call delays auto-log-out', function (t) {
	var sessionId1 = 'whatever'
	var contactAddress1 = 'whatever@example.com'
	var sessionId2 = 'hello'
	var contactAddress2 = 'hello@example.com'

	var initialState = init(500, Infinity)
	var asdb = initialState.authedSessionsDb
	var jlc = initialState.core
	var ss = initialState.sessionState

	authenticate(t, jlc, sessionId1, contactAddress1)
	authenticate(t, jlc, sessionId2, contactAddress2)

	var assertAuthenticated1 = assertSession(t, asdb, sessionId1, contactAddress1)
	var assertAuthenticated2 = assertSession(t, asdb, sessionId2, contactAddress2)

	setTimeout(function () {
		assertAuthenticated1(true)
		assertAuthenticated2(true)

		ss.isAuthenticated(sessionId1, function (err, contactAddress) {
			t.ifError(err)
			t.equal(contactAddress, contactAddress1, 'contactAddress is correct')
		})
	}, 300)

	setTimeout(function () {
		assertAuthenticated1(true)
		assertAuthenticated2(false)
	}, 700)

	setTimeout(function () {
		assertAuthenticated1(false, t.end.bind(t))
	}, 900)
})

test('auto-delete-session', function (t) {
	var assertSessionExists = null

	var initialState = init(Infinity, 200)
	var sdb = initialState.sessionsDb
	var ss = initialState.sessionState

	ss.createSession(function (err, sessionId) {
		t.ifError(err)
		assertSessionExists = assertSession(t, sdb, sessionId)
	})

	setTimeout(function () {
		assertSessionExists(true)
	}, 180)

	setTimeout(function () {
		assertSessionExists(false, t.end.bind(t))
	}, 300)
})

test('sessionExists() call delays auto-delete-session', function (t) {
	var sid1 = null
	var assertSession1Exists = null
	var assertSession2Exists = null

	var initialState = init(Infinity, 500)
	var sdb = initialState.sessionsDb
	var ss = initialState.sessionState

	ss.createSession(function (err, sessionId1) {
		t.ifError(err)
		assertSession1Exists = assertSession(t, sdb, sessionId1)
		sid1 = sessionId1
	})
	ss.createSession(function (err, sessionId2) {
		t.ifError(err)
		assertSession2Exists = assertSession(t, sdb, sessionId2)
	})


	setTimeout(function () {
		assertSession1Exists(true)
		assertSession2Exists(true)

		ss.sessionExists(sid1, function (err, time) {
			t.ifError(err)
		})
	}, 300)

	setTimeout(function () {
		assertSession1Exists(true)
		assertSession2Exists(false)
	}, 700)

	setTimeout(function () {
		assertSession1Exists(false, t.end.bind(t))
	}, 900)
})

test('auto-delete-session does not extend auto-log-out', function (t) {
	var contactAddress = 'example@example.com'

	var initialState = init(700, 500) // unauth, delSess
	var asdb = initialState.authedSessionsDb
	var sdb = initialState.sessionsDb
	var jlc = initialState.core
	var ss = initialState.sessionState

	ss.createSession(function (err, sessionId) {
		t.ifError(err)

		authenticate(t, jlc, sessionId, contactAddress)

		var assertAuthenticated = assertSession(t, asdb, sessionId, contactAddress)
		var assertSessionExists = assertSession(t, sdb, sessionId)

		setTimeout(function () {
			assertAuthenticated(true)
			assertSessionExists(true)
		}, 400)

		setTimeout(function () {
			assertAuthenticated(true)
			assertSessionExists(false)
		}, 600)

		setTimeout(function () {
			assertAuthenticated(false, t.end.bind(t))
		}, 800)
	})
})

test('auto-log-out does not extend auto-delete-session, but unauthenticate() does', function (t) {
	var contactAddress1 = 'example1@example.com'
	var contactAddress2 = 'example2@example.com'

	var initialState = init(500, 700) // unauth, delSess
	var asdb = initialState.authedSessionsDb
	var sdb = initialState.sessionsDb
	var jlc = initialState.core
	var ss = initialState.sessionState

	ss.createSession(function (err, sessionId1) {
		t.ifError(err)

		ss.createSession(function (err, sessionId2) {
			t.ifError(err)

			authenticate(t, jlc, sessionId1, contactAddress1)
			authenticate(t, jlc, sessionId2, contactAddress2)

			var assert4 = (function () {
				var auth1 = assertSession(t, asdb, sessionId1, contactAddress1)
				var auth2 = assertSession(t, asdb, sessionId2, contactAddress2)
				var sess1 = assertSession(t, sdb, sessionId1)
				var sess2 = assertSession(t, sdb, sessionId2)

				return function assertFour(a, b, c, d) {
					auth1(a)
					auth2(b)
					sess1(c)
					sess2(d)
				}
			})()

			setTimeout(assert4, 350, true, true, true, true)
			setTimeout(ss.unauthenticate, 400, sessionId1)
			setTimeout(assert4, 450, false, true, true, true)
			setTimeout(assert4, 600, false, false, true, true)
			setTimeout(assert4, 900, false, false, true, false)
			setTimeout(assert4, 1300, false, false, false, false)
			setTimeout(t.end.bind(t), 1400)
		})
	})
})
