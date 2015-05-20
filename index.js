var xtend = require('xtend')
var Expirer = require('expire-unused-keys')
var spaces = require('level-spaces')
var unauthenticate = require('./unauthenticate.js')
var isAuthenticated = require('./isAuthenticated.js')
var authenticate = require('./authenticate.js')

var defaultOptions = {
	sessionUnauthenticatedAfterMsInactivity: 7 * 24 * 60 * 60 * 1000, // 1 week
	sessionTimeoutCheckIntervalMs: 10 * 1000 // 10 sec
}

module.exports = function sessionState(core, db, opts) {
	if (!core) throw new Error('Expected a just-login-core instance')
	if (!db) throw new Error('Expected a levelup database')
	var options = xtend(defaultOptions, opts)

	var expirer = new Expirer(
		options.sessionUnauthenticatedAfterMsInactivity,
		spaces(db, 'session-expiration'),
		options.sessionTimeoutCheckIntervalMs
	)
	var authedSessionsDb = spaces(db, 'session')

	core.on('authenticated', authenticate(authedSessionsDb, expirer))

	core.unauthenticate = unauthenticate(authedSessionsDb, expirer)
	core.isAuthenticated = isAuthenticated(authedSessionsDb, expirer)

	expirer.on('expire', core.unauthenticate)

	return core
}
