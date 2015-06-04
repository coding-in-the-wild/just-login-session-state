var jsonParse = require('safe-json-parse')

module.exports = function a(authedSessionsDb, expirer, cb) {
	if (!cb) cb = function () {}
	return function authenticate(creds) {
		authedSessionsDb.get(creds.sessionId, function (err, sessionStr) {
			if (err) {
				cb(err)
			} else {
				jsonParse(sessionStr, function (err, sessionObj) {
					if (err) {
						cb(err)
					} else {
						sessionObj.loggedInAs = creds.contactAddress
						authedSessionsDb.put(creds.sessionId, sessionObj, function (err) {
							if (err) {
								cb(err)
							} else {
								expirer.touch(creds.sessionId)
								cb(null, creds)
							}
						})
					}
				})
			}
		})
	}
}
