/* */ 
var mkdirp = require("../index");
mkdirp('/tmp/foo/bar/baz', function(err) {
  if (err)
    console.error(err);
  else
    console.log('pow!');
});
