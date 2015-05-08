var lock = require('level-lock')

module.exports = function i(authedSessionsDb) {
	function isAuthenticated(sessionId, cb) { //cb(err, addr)
		if (typeof sessionId !== 'string') {
			process.nextTick(function () {
				cb(new Error('Session id is not a string.'))
			})
		} else {
			var unlockSession = lock(authedSessionsDb, sessionId, 'r')
			if (!unlockSession) {
				process.nextTick(function () {
					cb(new Error('Session read error'))
				})
			} else {
				cb = wrap(unlockSession, cb)
				authedSessionsDb.get(sessionId, cbIfErr(cb, function (err, address) {
					if (err && err.notFound) { //if notFound error
						cb(null, null)
					} else { //if no error
						expirer.touch(sessionId)
						cb(null, address)
					}
				}))
			}
		}
	}
}
