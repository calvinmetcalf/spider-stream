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