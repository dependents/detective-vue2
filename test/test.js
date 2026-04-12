'use strict';

const assert = require('assert').strict;
const { test } = require('uvu');
const detective = require('../index.js');

test('throws if the source content is not given', () => {
  assert.throws(() => {
    detective();
  }, /^Error: content not given$/);
});

test('throws if the source content is not a string', () => {
  assert.throws(() => {
    detective(() => {});
  }, /^Error: content is not a string$/);
});

test('retrieves the dependencies of script block lang ts', () => {
  const deps = detective('<template></template> <script lang="ts">import {foo, bar} from "mylib"; </script>');
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'mylib');
});

test('retrieves the dependencies of scss and script block lang ts', () => {
  const deps = detective('<template></template> <script lang="ts">import {foo, bar} from "mylib"; </script> <style lang="scss">@import \'vars.scss\' </style>');
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.scss');
});

test('retrieves the dependencies of scss and script block lang js', () => {
  const deps = detective('<template></template> <script>import {foo, bar} from "mylib"; </script> <style lang="sass">@import \'vars.scss\' </style>');
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.scss');
});

test('retrieves the dependencies of less and script block lang js', () => {
  const deps = detective('<template></template> <script>import {foo, bar} from "mylib"; </script> <style lang="less">@import \'vars.scss\' </style>');
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.scss');
});

test('retrieves the dependencies of script block lang ts using setup syntax', () => {
  const deps = detective(`<script lang="ts" setup>
import { foo, bar } from "mylib";
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
<OtherComponent />
</template>
`);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], './OtherComponent.vue');
});

test('retrieves the dependencies of script block lang ts using both setup and normal syntax', () => {
  const deps = detective(`<script lang="ts">
import { foo, bar } from "mylib";
</script>
<script setup lang="ts">
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
<OtherComponent />
</template>
`);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], './OtherComponent.vue');
});

test.run();
