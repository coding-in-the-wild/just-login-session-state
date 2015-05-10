var lock = require('level-lock')

module.exports = function u(authedSessionsDb, expirer) {
	return function unauthenticate(sessionId, cb) { //cb(err)
		cb = cb || function () {}
		if (typeof sessionId !== 'string') {
			setTimeout(cb, 0, new Error('Session id must be a string'))
		} else {
			expirer.forget(sessionId)
			var unlockSession = lock(authedSessionsDb, sessionId, 'w')
			if (!unlockSession) {
				setTimeout(cb, 0, new Error('Session write error'))
			} else {
				authedSessionsDb.del(sessionId, function (err) {
					unlockSession()
					cb(err? err : null)
				})
			}
		}
	}
}
