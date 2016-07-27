var nextTick = require('./nextTick.js')

module.exports = function s(sessionsDb, expirer) {
	return function sessionExists(sessionId, cb) {
		if (typeof sessionId !== 'string') {
			nextTick(cb, new Error('sessionExists() expects the sessionId to be a string'))
		} else {
			sessionsDb.get(sessionId, function (err, createdAt) {
				if (err && err.notFound) {
					cb(null, null)
				} else if (err) {
					cb(err, null)
				} else {
					expirer.touch(sessionId)
					cb(null, new Date(Number(createdAt)))
				}
			})
		}
	}
}
