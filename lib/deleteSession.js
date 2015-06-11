module.exports = function d(sessionsDb, expirer) {
	return function deleteSession(sessionId, cb) {
		sessionsDb.del(sessionId, function (err) {
			if (err) {
				expirer.forget(sessionId)
			}
			cb && cb(err)
		})
	}
}
