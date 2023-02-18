> Get the dependencies of Vue module

Supports Vue2 and Vue3

```sh
npm install detective-vue
```

### Usage

```js
const fs = require('fs');
const detective = require('detective-vue');

const mySourceCode = fs.readFileSync('myfile.vue', 'utf8');

// Pass in a file's content or an AST
const dependencies = detective(mySourceCode);
```

#### License

MIT
