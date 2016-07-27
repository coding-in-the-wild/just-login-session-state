var nextTick = require('./nextTick.js')

module.exports = function d(sessionsDb, expirer) {
	return function deleteSession(sessionId, cb) {
		if (typeof sessionId !== 'string') {
			nextTick(cb, new Error('deleteSession() expects the sessionId to be a string'))
		} else {
			sessionsDb.del(sessionId, function (err) {
				if (!err) {
					expirer.forget(sessionId)
				}
				nextTick(cb, err)
			})
		}
	}
}
