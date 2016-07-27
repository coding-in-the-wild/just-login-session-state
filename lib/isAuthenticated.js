module.exports = function i(authedSessionsDb, authedExpirer, expirer) {
	return function isAuthenticated(sessionId, cb) {
		if (typeof sessionId !== 'string') {
			process.nextTick(function () {
				cb(new Error('isAuthenticated() expects the sessionId to be a string'))
			})
		} else {
			authedSessionsDb.get(sessionId, function (err, address) {
				if (err && err.notFound) {
					cb(null, null)
				} else if (err) {
					cb(err)
				} else {
					authedExpirer.touch(sessionId)
					expirer.touch(sessionId)
					cb(null, address)
				}
			})
		}
	}
}
