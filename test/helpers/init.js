var Levelup = require('level-mem')
var spaces = require('level-spaces')
var JustLoginSessionState = require('../../index.js')

module.exports = function init(core, authed, timeout, interval) {
	var db = new Levelup()
	var opts = {
		unauthenticateAfterMs: timeout,
		deleteSessionAfterMs: timeout,
		checkIntervalMs: interval
	}
	JustLoginSessionState(core, db, opts)
	return spaces(db, authed ? 'authed-sessions' : 'sessions')
}
