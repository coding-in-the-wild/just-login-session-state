module.exports = function u(authedSessionsDb) {
	return function unauthenticate(sessionId, cb) { //cb(err)
		cb = cb || function () {}
		if (typeof sessionId !== 'string') {
			process.nextTick(function () {
				cb(new Error('Session id must be a string'))
			})
		} else {
			expirer.forget(sessionId)
			var unlockSession = lock(authedSessionsDb, sessionId, 'w')
			if (!unlockSession) {
				process.nextTick(function () {
					cb(new Error('Session write error'))
				})
			} else {
				authedSessionsDb.del(sessionId, function (err) {
					unlockSession()
					cb(err? err : null)
				})
			}
		}
	}
}
