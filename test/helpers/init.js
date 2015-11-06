var JustLoginCore = require('just-login-core')
var Levelup = require('level-mem')
var spaces = require('level-spaces')
var JustLoginSessionState = require('../../index.js')

module.exports = function init(unauthTimeout, delSessTimeout) {
	var db = new Levelup()
	var core = JustLoginCore(db)
	var sessionState = JustLoginSessionState(core, db, {
		unauthenticateAfterMs: unauthTimeout,
		deleteSessionAfterMs: delSessTimeout,
		checkIntervalMs: 50
	})
	return {
		authedSessionsDb: spaces(db, 'authed-sessions'),
		sessionsDb: spaces(db, 'sessions'),
		core: core,
		sessionState: sessionState
	}
}
