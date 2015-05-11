module.exports = function c(authedSessionsDb, expirer, cb) {
	return function createNewSession(creds) {
		authedSessionsDb.put(creds.sessionId, creds.contactAddress, function (err) {
			if (err) {
				cb(err)
			} else {
				expirer.touch(creds.sessionId)
				cb(null, creds)
			}
		})
	}
}
