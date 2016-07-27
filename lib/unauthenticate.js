module.exports = function u(authedSessionsDb, authedExpirer, expirer) {
	return function unauthenticate(sessionId, cb) {
		if (typeof cb !== 'function') {
			cb = function () {}
		}

		if (typeof sessionId !== 'string') {
			process.nextTick(function () {
				cb(new Error('unauthenticate() expects the sessionId to be a string'))
			})
		} else {
			authedExpirer.forget(sessionId)
			if (expirer) {
				expirer.touch(sessionId)
			}
			authedSessionsDb.del(sessionId, cb)
		}
	}
}
