module.exports = function u(authedSessionsDb, expirer) {
	return function unauthenticate(sessionId, cb) {
		cb = cb || function () {}
		if (typeof sessionId !== 'string') {
			setTimeout(cb, 0, new Error('Session id must be a string'))
		} else {
			expirer.forget(sessionId)
			authedSessionsDb.del(sessionId, cb)
		}
	}
}
