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

if you have a folder called foo, with a bar file and a baz folder in there with a bop file it will be called with `foo/bar` and `foo/baz/bop`

the second argument ignore is an optional way to specify files to ignore, curenetly the default is to ignore any file or folder that:

- is named .git
- is named .DS_Store
- ends in tilda

expect the default list to increase

If you pass `false` then nothing is ignored, passing an array then that array replaces the default one `['.git', '.DS_Store', '*~']` filenames are matched using minimatch, but at the moment, only the name not the full path.

If you pass a function then it will be called on each file with 2 argumens, the filename and the full path, return a truthy value if it should be ignored.