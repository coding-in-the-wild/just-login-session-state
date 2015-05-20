module.exports = function c(authedSessionsDb, expirer) {
	return function continueSession(sessionId, cb) { //cb(err, api, sessionId)
		if (!cb) cb = function () {}
		authedSessionsDb.get(sessionId, function (err, authed) {
			if (err) {
				cb(err)
			} else {
				expirer.touch(sessionId)
				cb(null, sessionId)
			}
		})
	}
}
