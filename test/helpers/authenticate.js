module.exports = function authenticate(t, jlc, sessionId, contactAddress, cb) {
	jlc.beginAuthentication(sessionId, contactAddress, function (err, credentials) {
		t.notOk(err, 'no error in beginAuth()')
		t.ok(credentials, 'credentials came back')
		t.ok(credentials && credentials.token, '\'credentials\' has \'token\'')
		t.ok(credentials && credentials.contactAddress, '\'credentials\' has \'contactAddress\'')
		t.equal(credentials && credentials.contactAddress, contactAddress, 'contact addresses are identical')
		jlc.authenticate(credentials.token, function (err2, credentials2) {
			t.notOk(err2, 'no error in beginAuth()')
			t.notOk(err2 && err2.notFound, 'no \'not found\' error in authenticate()')
			t.ok(credentials2, 'credentials come back in authenticate()')
			t.equal(credentials2 && credentials2.contactAddress, contactAddress, 'credentials are correct in authenticate()')

			if (cb) cb()
		})
	})
}
