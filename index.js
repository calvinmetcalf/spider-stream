var Readable = require('readable-stream').Readable;
var fs = require('fs');
var path = require('path');
var util = require('util');
var minimatch = require('minimatch');

module.exports = SpiderStream;
util.inherits(SpiderStream, Readable);

function SpiderStream(inPath, ignore) {
  if (!(this instanceof SpiderStream)) {
    return new SpiderStream(inPath, ignore);
  }
  Readable.call(this, {
    objectMode: true
  });
  if (Array.isArray(ignore)) {
    this.ignoreList = ignore;
  } else if (ignore === false) {
    this.ignoreList = [];
  } else if (typeof ignore === 'function') {
    this.isIgnored = ignore;
  }
  this.paths = [path.resolve(inPath)];
  this.inProgress = 0;
}

SpiderStream.prototype._read = function () {
  var self = this;
  var current = this.paths.pop();
  if (!current) {
    if (!self.inProgress) {
      self.push(null);
    }
    return;
  }
  self.inProgress++;
  fs.readdir(current, function (err, paths) {
    if (err) {
      return self.emit('error', err);
    }
    var todo = paths.length;
    if (!todo) {
      self.inProgress--;
      self._read();
    }
    var toPush = [];
    paths.forEach(function (file) {
      var fullPath = path.join(current, file);
      fs.stat(fullPath, function (err, stats) {
        todo--;
        if (!self.isIgnored(file, fullPath)) {
          if (stats.isFile()) {
            toPush.push(fullPath);
          } else if (stats.isDirectory()) {
            self.paths.push(fullPath);
          }
        }
        if (!todo) {
          if (!toPush.length) {
            self.inProgress--;
            self._read();
         } else {
          var full;
          toPush.forEach(function (thing) {
            if(!self.push(thing)) {
              full = true;
            }
          });
          if (!full) {
            self.inProgress--;
            self._read();
          }
         }
       }
      });
    });
  });
};
SpiderStream.prototype.ignoreList = [
  '.git',
  '.DS_Store',
  '*~'
];
SpiderStream.prototype.isIgnored = function (thing) {
  return this.ignoreList.some(function (term) {
    return minimatch(thing, term);
  });
};