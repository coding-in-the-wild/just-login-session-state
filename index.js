var Expirer = require('expire-unused-keys')
var spaces = require('level-spaces')
var authenticate = require('./lib/authenticate.js')
var createSession = require('./lib/createSession.js')
var deleteSession = require('./lib/deleteSession.js')
var sessionExists = require('./lib/sessionExists.js')
var unauthenticate = require('./lib/unauthenticate.js')
var isAuthenticated = require('./lib/isAuthenticated.js')

var defaultInactivity = 7 * 24 * 60 * 60 * 1000 // 1 week
var defaultInterval = 10 * 1000 // 10 sec

module.exports = function sessionState(core, db, opts) {
	if (!core) throw new Error('Expected a just-login-core instance')
	if (!db) throw new Error('Expected a levelup database')
	if (!opts) opts = {}

	var authedSessionsExpirer = new Expirer(
		opts.unauthenticateAfterMs || defaultInactivity,
		spaces(db, 'authed-session-expiration'),
		opts.checkIntervalMs || defaultInterval
	)
	var sessionsExpirer = new Expirer(
		opts.deleteSessionAfterMs || defaultInactivity,
		spaces(db, 'session-expiration'),
		opts.checkIntervalMs || defaultInterval
	)
	var authedSessionsDb = spaces(db, 'authed-sessions')
	var sessionsDb = spaces(db, 'sessions')

	core.on('authenticated', authenticate(authedSessionsDb, authedSessionsExpirer, sessionsExpirer))
	core.createSession = createSession(sessionsDb, sessionsExpirer)
	core.deleteSession = deleteSession(sessionsDb, sessionsExpirer)
	core.sessionExists = sessionExists(sessionsDb, sessionsExpirer)
	core.unauthenticate = unauthenticate(authedSessionsDb, authedSessionsExpirer, sessionsExpirer)
	core.isAuthenticated = isAuthenticated(authedSessionsDb, authedSessionsExpirer, sessionsExpirer)

	authedSessionsExpirer.on('expire', unauthenticate(authedSessionsDb, authedSessionsExpirer))
	sessionsExpirer.on('expire', core.deleteSession)

	return core
}
