var spider = require('../');
var tape = require('tape');
var mkdirp = require('mkdirp');

tape('basic', function (t) {
  mkdirp('./test/data/folder2/lala/aditional/something', function () {
    var stream = spider('./test/data');
    var out = [];
    stream.on('data', function (e) {
      out.push(e);
    }).on('end', function () {
      t.equals(out.length, 3, '3 things');
      t.end();
    });
  });
});

tape('more', function (t) {
  var stream = spider('./test/data2', false);
    var out = [];
    stream.on('data', function (e) {
      out.push(e);
    }).on('end', function () {
      t.equals(out.length, 61, 'correct length');
      t.end();
    });
});

tape('exclude', function (t) {
  var stream = new spider('./test/data2');
    var out = [];
    stream.on('data', function (e) {
      out.push(e);
    }).on('end', function () {
      t.equals(out.length, 49, 'correct length');
      t.end();
    });
});

tape('custom exclude list', function (t) {
  var stream = new spider('./test/data2', ['adapter', '.DS_Store', '*~']);
    var out = [];
    stream.on('data', function (e) {
      out.push(e);
    }).on('end', function () {
      t.equals(out.length, 45, 'correct length');
      t.end();
    });
});
tape('custom exclude function', function (t) {
  var stream = new spider('./test/data2', function (thing) {

    if (thing.indexOf('.') === -1) {
      return false;
    } else {
      if (thing === 'index.js') {
        return false;
      }
    }
    return true;
  });
    var out = [];
    stream.on('data', function (e) {
      out.push(e);
    }).on('end', function () {
      t.equals(out.length, 13, 'correct length');
      t.end();
    });
});