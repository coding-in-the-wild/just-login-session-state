module.exports = function (t, db, sessionId, contactAddress) {
	return function (expect, cb) {
		db.get(sessionId, function (err, addressOrTime) {
			if (expect) {
				t.notOk(err, 'expected to be authenticated')
				if (contactAddress) {
					t.equal(addressOrTime, contactAddress, 'expected contact address')
				} else {
					var now = new Date().getTime()
					var then = Number(addressOrTime)
					t.ok((then < now) && ((then + 1000) > now), 'expected date near this time')
				}
			} else {
				t.ok(err && err.notFound, 'did not expect to be authenticated')
				t.notOk(addressOrTime, 'credentials or time does not come back')
			}
			if (cb) cb()
		})
	}
}
