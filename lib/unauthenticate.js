module.exports = function u(authedSessionsDb, authedExpirer, expirer) {
	return function unauthenticate(sessionId, cb) {
		authedExpirer.forget(sessionId)
		if (expirer) {
			expirer.touch(sessionId)
		}
		if (typeof cb !== 'function') {
			cb = function () {}
		}
		authedSessionsDb.del(sessionId, cb)
	}
}
