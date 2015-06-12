module.exports = function a(authedSessionsDb, authedExpirer, expirer) {
	return function authenticate(creds) {
		authedSessionsDb.put(creds.sessionId, creds.contactAddress, function (err) {
			if (!err) {
				authedExpirer.touch(creds.sessionId)
				expirer.touch(creds.sessionId)
			}
		})
	}
}
