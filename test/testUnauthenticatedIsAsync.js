test('throw the ring into mount doom (unauth)', function(t) {
	var db = Levelup('newThang')
	var jlc = JustLoginCore(db, jlcOpts)
	var sdb = spaces(db, 'session')

	var x = false, y = false, z = false
	jlc.unauthenticate(dumbSession, function (err, value) { x = err || true })
	var unlock = lock(sdb, dumbSession, 'rw')
	jlc.unauthenticate(dumbSession, function (err, value) { y = err || true })
	unlock()
	jlc.unauthenticate(null, function (err, value) { z = err || true })

	t.equal(false, x, 'mount doom')
	t.equal(false, y, 'gaaannndallfff!!')
	t.equal(false, z, 'they stole it from ussss!!!!!')

	t.end()
})
