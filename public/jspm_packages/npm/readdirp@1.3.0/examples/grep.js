/* */ 
(function(process) {
  'use strict';
  var readdirp = require("../readdirp"),
      util = require("util"),
      fs = require("fs"),
      path = require("path"),
      es = require("event-stream");
  ;
  function findLinesMatching(searchTerm) {
    return es.through(function(entry) {
      var lineno = 0,
          matchingLines = [],
          fileStream = this;
      function filter() {
        return es.mapSync(function(line) {
          lineno++;
          return ~line.indexOf(searchTerm) ? lineno + ': ' + line : undefined;
        });
      }
      function aggregate() {
        return es.through(function write(data) {
          matchingLines.push(data);
        }, function end() {
          if (matchingLines.length) {
            var result = {
              file: entry,
              lines: matchingLines
            };
            fileStream.emit('data', result);
          }
          this.emit('end');
        });
      }
      fs.createReadStream(entry.fullPath, {encoding: 'utf-8'}).pipe(es.split('\n')).pipe(filter()).pipe(aggregate());
      ;
    });
  }
  console.log('grepping for "arguments"');
  readdirp({
    root: path.join(__dirname),
    fileFilter: '*.js'
  }).pipe(findLinesMatching('arguments')).pipe(es.mapSync(function(res) {
    return '\n\n' + res.file.path + '\n\t' + res.lines.join('\n\t');
  })).pipe(process.stdout);
  ;
})(require("process"));
