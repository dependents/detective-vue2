import { describe, it, expect } from 'vitest';
import detective from '../index.js';

describe('detective-vue2', () => {
  it('throws if the source content is not given', () => {
    expect(() => {
      detective();
    }).toThrow(new Error('content not given'));
  });

  it('throws if the source content is not a string', () => {
    expect(() => {
      detective(() => {});
    }).toThrow(new Error('content is not a string'));
  });

  it('retrieves the dependencies of script block with lang ts', () => {
    const fixture = `<template></template>
<script lang="ts">
import { foo, bar } from "mylib";
</script>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib']);
  });

  it('retrieves the dependencies of scss and script block with lang ts', () => {
    const fixture = `<template></template>
<script lang="ts">
import { foo, bar } from "mylib";
</script>
<style lang="scss">
@import 'vars.scss';
</style>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib', 'vars.scss']);
  });

  it('retrieves the dependencies of scss and script block with lang js', () => {
    const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style lang="sass">
@import 'vars.scss'
</style>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib', 'vars.scss']);
  });

  it('retrieves the dependencies of less and script block with lang js', () => {
    const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style lang="less">
@import 'vars.less';
</style>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib', 'vars.less']);
  });

  it('retrieves the dependencies of stylus and script block with lang js', () => {
    const fixture = `<template></template>
<script>
import { foo, bar } from "mylib";
</script>
<style lang="stylus">
@import 'vars.styl';
</style>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib', 'vars.styl']);
  });

  it('retrieves the dependencies of script block with lang ts using setup syntax', () => {
    const fixture = `<script lang="ts" setup>
import { foo, bar } from "mylib";
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
  <OtherComponent />
</template>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib', './OtherComponent.vue']);
  });

  it('retrieves the dependencies of script block with lang ts using both setup and normal syntax', () => {
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
    expect(deps).toStrictEqual(['mylib', './OtherComponent.vue']);
  });

  it('retrieves the dependencies of script setup block without lang', () => {
    const fixture = `<script setup>
import { foo, bar } from "mylib";
import OtherComponent from "./OtherComponent.vue";
</script>
<template>
  <OtherComponent />
</template>
`;
    const deps = detective(fixture);
    expect(deps).toStrictEqual(['mylib', './OtherComponent.vue']);
  });

  it('ignores plain CSS style blocks', () => {
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
    expect(deps).toStrictEqual(['mylib']);
  });
});
