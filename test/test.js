import { strict as assert } from 'node:assert';
import { test } from 'uvu';
import detective from '../index.js';

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

test('retrieves the dependencies of script block with lang ts', () => {
  const fixture = `<template></template>
<script lang="ts">
import { foo, bar } from "mylib";
</script>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'mylib');
});

test('retrieves the dependencies of scss and script block with lang ts', () => {
  const fixture = `<template></template>
<script lang="ts">
import { foo, bar } from "mylib";
</script>
<style lang="scss">
@import 'vars.scss';
</style>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.scss');
});

test('retrieves the dependencies of scss and script block with lang js', () => {
  const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style lang="sass">
@import 'vars.scss'
</style>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.scss');
});

test('retrieves the dependencies of less and script block with lang js', () => {
  const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style lang="less">
@import 'vars.less';
</style>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.less');
});

test('retrieves the dependencies of stylus and script block with lang js', () => {
  const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style lang="stylus">
@import 'vars.styl';
</style>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'vars.styl');
});

test('retrieves the dependencies of script block with lang ts using setup syntax', () => {
  const fixture = `<script lang="ts" setup>
import { foo, bar } from "mylib";
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
  <OtherComponent />
</template>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], './OtherComponent.vue');
});

test('retrieves the dependencies of script block with lang ts using both setup and normal syntax', () => {
  const fixture = `<script lang="ts">
import { foo, bar } from "mylib";
</script>
<script setup lang="ts">
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
  <OtherComponent />
</template>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], './OtherComponent.vue');
});

test('retrieves the dependencies of script setup block without lang', () => {
  const fixture = `<script setup>
import { foo, bar } from "mylib";
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
  <OtherComponent />
</template>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], './OtherComponent.vue');
});

test('ignores plain CSS style blocks', () => {
  const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style>
.foo {
  color: red;
}
</style>
`;
  const deps = detective(fixture);
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'mylib');
});

test.run();
