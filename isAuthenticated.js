var lock = require('level-lock')

module.exports = function i(authedSessionsDb, expirer) {
	return function isAuthenticated(sessionId, cb) { //cb(err, addr)
		if (typeof sessionId !== 'string') {
			setTimeout(cb, 0, new Error('Session id is not a string.'))
		} else {
			var unlockSession = lock(authedSessionsDb, sessionId, 'r')
			if (!unlockSession) {
				setTimeout(cb, 0, new Error('Session read error'))
			} else {
				authedSessionsDb.get(sessionId, function (err, address) {
					unlockSession()
					if (err && err.notFound) { //if notFound error
						cb(null, null)
					} else if (err) {
						cb(err)
					} else { //if no error
						expirer.touch(sessionId)
						cb(null, address)
					}
				})
			}
		}
	}
}
