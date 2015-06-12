module.exports = function s(sessionsDb, expirer) {
	return function sessionExists(sessionId, cb) {
		sessionsDb.get(sessionId, function (err, createdAt) {
			if (err && err.notFound) {
				cb(null, null)
			} else if (err) {
				cb(err, null)
			} else {
				expirer.touch(sessionId)
				console.log('createdAt: ' + new Date(Number(createdAt)))
				cb(null, new Date(Number(createdAt)))
			}
		})
	}
}
