var Levelup = require('level-mem')
var spaces = require('level-spaces')
var JustLoginSessionState = require('../../index.js')

module.exports = function init(core, opts) {
	var db = new Levelup()
	JustLoginSessionState(core, db, opts)
	return spaces(db, 'session')
}
