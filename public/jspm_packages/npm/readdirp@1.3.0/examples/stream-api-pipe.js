/* */ 
(function(process) {
  var readdirp = require("../readdirp"),
      path = require("path"),
      through = require("through2");
  readdirp({
    root: path.join(__dirname),
    fileFilter: '*.js'
  }).on('warn', function(err) {
    console.error('non-fatal error', err);
  }).on('error', function(err) {
    console.error('fatal error', err);
  }).pipe(through.obj(function(entry, _, cb) {
    this.push({
      path: entry.path,
      size: entry.stat.size
    });
    cb();
  })).pipe(through.obj(function(res, _, cb) {
    this.push(JSON.stringify(res) + '\n');
    cb();
  })).pipe(process.stdout);
})(require("process"));
