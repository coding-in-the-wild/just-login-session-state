module.exports = function i(authedSessionsDb, expirer) {
	return function isAuthenticated(sessionId, cb) { //cb(err, addr)
		if (typeof sessionId !== 'string') {
			setTimeout(cb, 0, new Error('Session id is not a string.'))
		} else {
			authedSessionsDb.get(sessionId, function (err, address) {
				if (err && err.notFound) {
					cb(null, null)
				} else if (err) {
					cb(err)
				} else {
					expirer.touch(sessionId)
					cb(null, address)
				}
			})
		}
	}
}
