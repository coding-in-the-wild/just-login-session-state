module.exports = function d(authedSessionsDb, expirer) {
	return function deleteSession(sessionId, cb) {
		authedSessionsDb.del(sessionId, function () {
			expirer.forget(sessionId)
			cb && cb()
		})
	}
}
