var xtend = require('xtend')
var Expirer = require('expire-unused-keys')
var lock = require('level-lock')
var Unauthenticate = require('./unauthenticate.js')
var IsAuthenticated = require('./isAuthenticated.js')
var defaultOptions = {
	sessionUnauthenticatedAfterMsInactivity: 7 * 24 * 60 * 60 * 1000, // 1 week
	sessionTimeoutCheckIntervalMs: 10 * 1000 // 10 sec
}

function extendCore(core, db) {
	var authedSessionsDb = spaces(db, 'session')

	core.on('authenticated', function createNewSession(creds) {
		var unlockSession = lock(authedSessionsDb, creds.sessionId, 'w')
		if (!unlockSession) {
			cb(new Error('Session write error'))
		} else {
			authedSessionsDb.put(creds.sessionId, creds.contactAddress, function (err) {
				if (err) {
					unlockSession()
					cb(err)
				} else {
					unlockSession()
					expirer.touch(creds.sessionId)
					cb(null, creds)
				}
			})
		}
	})

	core.unauthenticate = Unauthenticate(authedSessionsDb)
	core.isAuthenticated = IsAuthenticated(authedSessionsDb)
}

module.exports = function sessionState(core, db, opts) {
	var options = xtend(defaultOptions, opts)

	extendCore(core, db)

	var expirer = new Expirer(
		options.sessionUnauthenticatedAfterMsInactivity,
		spaces(db, 'session-expiration'),
		options.sessionTimeoutCheckIntervalMs
	)

	expirer.on('expire', core.unauthenticate)
}
