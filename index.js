var Readable = require('readable-stream').Readable;
var fs = require('fs');
var path = require('path');
var util = require('util');

module.exports = SpiderStream;
util.inherits(SpiderStream, Readable);

function SpiderStream(inPath) {
  if (!(this instanceof SpiderStream)) {
    return new SpiderStream(inPath);
  }

  Readable.call(this, {
    objectMode: true
  });

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
        if (stats.isFile()) {
          toPush.push(fullPath);
        } else if (stats.isDirectory()) {
          self.paths.push(fullPath);
        }
       if (!todo) {
        self.inProgress--;
         if (!toPush.length) {
            self._read();
         } else {
          var full;
          toPush.forEach(function (thing) {
            if(!self.push(thing)) {
              full = true;
            }
            if (!full) {
              self._read();
            }
          });
         }
       }
      });
    });
  });
};