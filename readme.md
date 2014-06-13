spider stream
=====

```bash
npm install spider-stream
```

```js
var spiderStream = require('spiderStream');
spiderStream('path', ignore).pipe(...);
```

Give it a path and it will give you a stream of paths that are contained.

If you have a folder called foo, with a bar file and a baz folder in there with a bop file it will be called with `foo/bar` and `foo/baz/bop`.

The second argument `ignore` is an optional way to specify files to ignore, currently the default is to ignore any file or folder that:

- is named .git
- is named .DS_Store
- ends in tilda

_Note: expect the default list to increase._

If you pass `false` then nothing is ignored, passing an array replaces the default one `['.git', '.DS_Store', '*~']` filenames are matched using [minimatch][minimatch], but at the moment, only the name not the full path.

If you pass a function then it will be called on each file with 2 arguments, the filename and the full path, return a truthy value if it should be ignored.

[minimatch]: https://github.com/isaacs/minimatch
