module.exports = function d(sessionsDb, expirer) {
	return function deleteSession(sessionId, cb) {
		if (typeof cb !== 'function') {
			cb = function () {}
		}

		if (typeof sessionId !== 'string') {
			process.nextTick(function () {
				cb(new Error('deleteSession() expects the sessionId to be a string'))
			})
		} else {
			sessionsDb.del(sessionId, function (err) {
				if (!err) {
					expirer.forget(sessionId)
				}
				cb(err)
			})
		}
	}
}
