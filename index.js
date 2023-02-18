'use strict';

const compiler = require('@vue/compiler-sfc')
const detectiveTypeScript = require('detective-typescript')
const detectiveEs6 = require('detective-es6')
const detectiveScss = require('detective-scss')
const detectiveStylus = require('detective-stylus')
const detectiveSass = require('detective-sass')

const isVue3 = typeof compiler.parseComponent === 'undefined';

/**
 * Extracts the dependencies of the supplied Vue module
 */
module.exports = function vueDetective(fileContent, opts) {
  if (typeof fileContent === 'undefined') throw new Error('content not given');
  if (typeof fileContent !== 'string') throw new Error('content is not a string');

  let script, styles;

  if (isVue3) {
    const result = compiler.parse(fileContent, {sourceMap: false})
    styles = result.descriptor.styles;
    script = result.descriptor.script;
  } else {
    const result = compiler.parse({source: fileContent, sourceMap: false})
    styles = result.styles;
    script = result.script;
  }

  const dependencies = [];

  if (script && script.content) {
    if (script.attrs && script.attrs.lang === 'ts') {
      dependencies.push(...detectiveTypeScript(script.content, opts))
    } else {
      dependencies.push(...detectiveEs6(script.content, opts))
    }
  }

  if (styles) {
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      const styleLan = style.attrs.lang;

      if (styleLan === 'scss') {
        dependencies.push(...detectiveScss(style.content))
      } else if (styleLan === 'stylus') {
        dependencies.push(...detectiveStylus(style.content))
      } else if (styleLan === 'sass') {
        dependencies.push(...detectiveSass(style.content))
      } else {
        // css has no deps
      }
    }
  }

  return dependencies;
}
