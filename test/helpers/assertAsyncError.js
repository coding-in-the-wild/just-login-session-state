module.exports = function aae(fn, args, cb) {
	var syncErr = null
	try {
		fn.apply(null, args)
	} catch (e) {
		syncErr = e
	}

	process.on('uncaughtException', end)
	var timer = setTimeout(end, 1000, null)

	function end(asyncErr) {
		process.removeListener('uncaughtException', end)
		clearTimeout(timer)
		cb(asyncErr, syncErr)
	}
}
