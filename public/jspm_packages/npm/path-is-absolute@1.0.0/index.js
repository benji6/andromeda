/* */ 
(function(process) {
  'use strict';
  function posix(path) {
    return path.charAt(0) === '/';
  }
  ;
  function win32(path) {
    var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
    var result = splitDeviceRe.exec(path);
    var device = result[1] || '';
    var isUnc = !!device && device.charAt(1) !== ':';
    return !!result[2] || isUnc;
  }
  ;
  module.exports = process.platform === 'win32' ? win32 : posix;
  module.exports.posix = posix;
  module.exports.win32 = win32;
})(require("process"));
