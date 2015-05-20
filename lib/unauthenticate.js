module.exports = function u(authedSessionsDb, expirer) {
	return function unauthenticate(sessionId, cb) {
		expirer.forget(sessionId)
		authedSessionsDb.del(sessionId, cb || function () {})
	}
}
