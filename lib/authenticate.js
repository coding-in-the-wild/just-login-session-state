module.exports = function a(authedSessionsDb, expirer, cb) {
	if (!cb) cb = function () {}
	return function authenticate(creds) {
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
