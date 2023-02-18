/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const detective = require('../index.js');

describe('detective-vue2', () => {
  it('retrieves the dependencies of script block lang ts', () => {
    const deps = detective('<template></template> <script lang="ts">import {foo, bar} from "mylib"; </script>');
    assert.equal(deps.length, 1);
    assert.equal(deps[0], 'mylib');
  });

  it('retrieves the dependencies of scss and script block lang ts', () => {
    const deps = detective(`<template></template> <script lang="ts">import {foo, bar} from "mylib"; </script> <style lang="scss">@import 'vars.scss' </style>`);
    assert.equal(deps.length, 2);
    assert.equal(deps[0], 'mylib');
    assert.equal(deps[1], 'vars.scss');
  });

  it('retrieves the dependencies of scss and script block lang js', () => {
    const deps = detective(`<template></template> <script>import {foo, bar} from "mylib"; </script> <style lang="sass">@import 'vars.scss' </style>`);
    assert.equal(deps.length, 2);
    assert.equal(deps[0], 'mylib');
    assert.equal(deps[1], 'vars.scss');
  });
});
