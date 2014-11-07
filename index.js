var fs = require('fs');
var path = require('path');
var noms = require('noms');
var minimatch = require('minimatch');

module.exports = spiderStream;

function spiderStream(inPath, ignore) {
  var ignoreList =[
    '.git',
    '.DS_Store',
    '*~'
  ];
  var isIgnored = function (thing) {
    return ignoreList.some(function (term) {
      return minimatch(thing, term);
    });
  };
  if (Array.isArray(ignore)) {
    ignoreList = ignore;
  } else if (ignore === false) {
    ignoreList = [];
  } else if (typeof ignore === 'function') {
    isIgnored = ignore;
  }
  var stack = [path.resolve(inPath)];
  return noms(function(next) {
    if (!stack.length) {
      //we are done
      return next(null, null);
    }
    var self = this;
    var current = stack.pop();
    fs.readdir(current, function (err, paths) {
      if (err) {
        return next(err);
      }
      if (!paths.length) {
        // this directory is empty
        return next();
      }
     var todo = paths.length;
     paths.forEach(function (file) {
        var fullPath = path.join(current, file);
        fs.stat(fullPath, function (err, stats) {
          todo--;
          if (err) {
            return next(err);
          }
          if (!isIgnored(file, fullPath)) {
            if (stats.isFile()) {
              self.push(fullPath);
            } else if (stats.isDirectory()) {
              stack.push(fullPath);
            }
          }
          if (!todo) {
            next();
          }
        });
      });
    });
  });
}