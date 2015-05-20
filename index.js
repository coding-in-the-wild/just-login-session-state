var Expirer = require('expire-unused-keys')
var spaces = require('level-spaces')
var authenticate = require('./lib/authenticate.js')
var createSession = require('./lib/createSession.js')
var continueSession = require('./lib/continueSession.js')
var unauthenticate = require('./lib/unauthenticate.js')
var isAuthenticated = require('./lib/isAuthenticated.js')

var defaultInactivity = 7 * 24 * 60 * 60 * 1000 // 1 week
var defaultInterval = 10 * 1000 // 10 sec

module.exports = function sessionState(core, db, opts) {
	if (!core) throw new Error('Expected a just-login-core instance')
	if (!db) throw new Error('Expected a levelup database')
	if (!opts) opts = {}

	var expirer = new Expirer(
		opts.sessionUnauthenticatedAfterMsInactivity || defaultInactivity,
		spaces(db, 'session-expiration'),
		opts.sessionTimeoutCheckIntervalMs || defaultInterval
	)
	var authedSessionsDb = spaces(db, 'session')

	core.on('authenticated', authenticate(authedSessionsDb, expirer))
	core.createSession = createSession(authedSessionsDb, expirer)
	core.continueSession = continueSession(authedSessionsDb, expirer)
	core.unauthenticate = unauthenticate(authedSessionsDb, expirer)
	core.isAuthenticated = isAuthenticated(authedSessionsDb, expirer)

	expirer.on('expire', core.unauthenticate)

	return core
}
