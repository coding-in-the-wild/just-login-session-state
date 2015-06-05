var uuid = require('random-uuid-v4')

module.exports = function c(sessionsDb, expirer) {
	return function createSession(cb) {
		if (!cb) cb = function () {}
		var sessionId = uuid()
		var now = new Date().getTime()
		sessionsDb.put(sessionId, now, function (err) {
			if (err) {
				cb(err)
			} else {
				expirer.touch(sessionId)
				cb(null, sessionId)
			}
		})
	}
}
