module.exports = function d(sessionsDb, expirer) {
	return function deleteSession(sessionId, cb) {
		sessionsDb.del(sessionId, function () {
			expirer.forget(sessionId)
			cb && cb()
		})
	}
}
