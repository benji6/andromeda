net-browserify
==============

`net` module for browserify, with a websocket server proxy.

Supported methods:
* `net.connect(options, cb)`
* `net.isIP(input)`, `net.isIPv4(input)`, `net.isIPv6(input)`

How to use
----------

### For the client

Just require this module or map this module to the `net` module with [Browserify](https://github.com/substack/node-browserify).
```
$ npm install net-browserify
```

You can set a custom proxy address if you want to:
```js
var net = require('net');

// Optionaly, set a custom proxy address
net.setProxy({
	hostname: 'example.org',
	port: 42
});
```

### For the server

```js
var express = require('express');
var netApi = require('net-browserify/api');

// Create a server
var server = require('http').createServer();

// Create our app
var app = express();
server.addListener('request', app);

app.use(netApi(server));

// Start the server
server.listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'));
});
```

> The API takes `server` as an argument since [`ws`](https://www.npmjs.org/package/ws) requires it.

You can also specify some options:
```js
app.use(netApi(server, {
	allowOrigin: '*', // Allow access from any origin
	to: [ // Restrict destination
		{ host: 'example.org', port: 42 }, // Restrict to example.org:42
		{ host: 'example.org' }, // Restrict to example.org, allow any port
		{ port: 42 }, // Restrict to port 42 only, allow any host
		{ host: 'bad.com', blacklist: true } // Blacklist bad.com
		// And so on...
	]
}));
```

License
-------

The MIT license.
