var uuid = require('random-uuid-v4')

module.exports = function c(authedSessionsDb, expirer) {
	return function createSession(cb) {
		if (!cb) cb = function () {}
		var sessionId = uuid()
		authedSessionsDb.put(sessionId, 'null', function (err) {
			if (err) {
				cb(err)
			} else {
				expirer.touch(sessionId)
				cb(null, sessionId)
			}
		})
	}
}
