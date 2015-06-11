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

## `core = sessionState(core, db, [options])`

- `core` is an instance of a [just-login-core][jlc].
- `db` is expecting a levelup database.
- `options` is an optional object:
	- `unauthenticatedAfterMs` is a number in milliseconds of a session's period of inactivity before they are unauthenticated. (Calling `authenticate()`/`isAuthenticated()` counts as activity.)  Defaults to 1 week.
	- `deleteSessionAfterMs` is a number in milliseconds of a session's period of inactivity before the session is deleted. If the user does not call `isAuthenticated()` within that time period, their session will be deleted. Defaults to 1 week.
	- `checkIntervalMs` is a number in milliseconds of the session's timeout's check interval. (See [expireUnusedKeys({checkIntervalMs})](https://github.com/TehShrike/expire-unused-keys#timeoutms-db-checkintervalms).) Defaults to 10 seconds.
- Returns the modified `core`.

## `core.createSession(cb)`

Creates a new (unauthenticated) session.

- `cb` is a function that has the following arguments:
	- `err` is `null` or an `Error` object.
	- `sessionId` is a string of the new session id.

```js
core.createSession(function(err, sessionId) {
	console.log(err ? err.message : 'session created, not logged in though')
})
```

## `core.sessionExists(sessionId, cb)`

- `sessionId` is a string of the session id for which to check the existence.
- `cb` is a function that has the following arguments:
	- `err` is `null` or an `Error` object.
	- `date` is `null` if the session does not exist, otherwise it is a `date` object.

```js
core.createSession(function(err, sessionId) {
	console.log(err ? err.message : 'session created, not logged in though')
})
```

## `core.deleteSession(sessionId, [cb])`

- `sessionId` is a string of the session id to delete.
- `cb` is an optional function that has the following argument:
	- `err` is `null` or an `Error` object.

```js
core.createSession(function(err, sessionId) {
	console.log(err ? err.message : 'session created, not logged in though')
})
```

## `core.isAuthenticated(sessionId, cb)`

Checks if a user is authenticated. (Logged in.)

- `sessionId` is a string of the session id in question.
- `cb` is a function with the following arguments:
	- `err` is `null` or an `Error` object.
	- `contactAddress` is `null` is the user is not authenticated, otherwise it is a string of their contact address.

```js
core.isAuthenticated('whatever the session id is', function(err, contactAddress) {
	if (!err) {
		console.log(contactAddress)
		//if not logged in, logs 'null'
		//if logged in, logs: 'fake@example.com'
	}
})
```

## `core.unauthenticate(sessionId, [cb])`

Sets the appropriate session id to be unauthenticated.

- `sessionId` is a string of the session id that is trying to get authenticated.
- `cb` is an optional function with the following argument:
	- `err` is `null` or an `Error` object.

```js
core.unauthenticate('session', function(err) {
	console.log(err ? err.message : 'you have been logged out')
})
```

# License

[VOL](http://veryopenlicense.com/)


[jlc]: https://github.com/coding-in-the-wild/just-login-core
