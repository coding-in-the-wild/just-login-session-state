just-login-session-state
===============

[![Build Status](https://travis-ci.org/coding-in-the-wild/just-login-session-state.svg)](https://travis-ci.org/coding-in-the-wild/just-login-session-state)

Handles session state for [just-login][jlc].

# example

```js
var Core = require('just-login-core')
var sessionState = require('just-login-session-state')
var Level = require('level-mem')
var tokenDb = new Level()
var sessionDb = new Level()

var core = Core(tokenDb)
sessionState(core, sessionDb)
```

# api

```js
var sessionState = require('just-login-session-state')
```

## `core = sessionState(core, db, options)`

- `core` is an instance of a [just-login-core][jlc].
- `db` is expecting a levelup database.
- `options` is an optional object:
	- `sessionUnauthenticatedAfterMsInactivity` is a number in milliseconds of a session's period of inactivity before they are unauthenticated. If the user does not call `isAuthenticated()` within that time period, thy will be unauthenticated. (Logged out.) Defaults to 1 week.
	- `sessionTimeoutCheckIntervalMs` is a number in milliseconds of the session's timeout's check interval. (See [expireUnusedKeys({checkIntervalMs})][checkint].) Defaults to 10 seconds.
- Returns the modified `core`.

## `core.isAuthenticated(sessionId, cb)`

Checks if a user is authenticated. (Logged in.)

- `sessionId` is a string of the session id in question.
- `cb` is a function with the following arguments:
	- `err` is `null` if there was no error, and is an `Error` object if there was an error.
	- `contactAddress` is `null` is the user is not authenticated, and is a string of their contact address if they are authenticated.

```js
core.isAuthenticated("whatever the session id is", function(err, contactAddress) {
	if (!err) {
		console.log(contactAddress)
		//if not logged in, logs "null"
		//if logged in, logs: "fake@example.com"
	}
})
```

## `core.unauthenticate(sessionId, [cb])`

Sets the appropriate session id to be unauthenticated.

- `sessionId` is a string of the session id that is trying to get authenticated.
- `cb` is an optional function that defaults to a no-op. It has the following argument:
	- `err` is `null` if there was no error, and is an `Error` object if there was an error.

```js
core.unauthenticate("thisIsAValidToken", function(err) {
	if (err) {
		console.log("error:", err.message) //this is expected for invalid tokens (not previously logged in)
	} else {
		console.log("you have been logged out") //this is expected for valid tokens (previously logged in)
	}
})
```

# License

[VOL](http://veryopenlicense.com/)


[jlc]: https://github.com/coding-in-the-wild/just-login-core
