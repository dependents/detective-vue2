import { parse } from '@vue/compiler-sfc';
import detectiveTypeScript from 'detective-typescript';
import detectiveEs6 from 'detective-es6';
import detectiveScss from 'detective-scss';
import detectiveStylus from 'detective-stylus';
import detectiveSass from 'detective-sass';
import detectiveLess from '@dependents/detective-less';

/**
 * Extracts the dependencies of the supplied Vue module.
 *
 * @param {string} content - The Vue SFC source code
 * @param {object} [options]
 * @param {boolean} [options.skipTypeImports] - Skip type-only imports (script blocks)
 * @param {boolean} [options.skipAsyncImports] - Skip dynamic `import()` expressions (script blocks)
 * @param {boolean} [options.mixedImports] - Include CJS `require()` calls (TS script blocks only)
 * @param {boolean} [options.jsx] - Enable JSX/TSX parsing (TS script blocks only)
 * @param {boolean} [options.url] - Detect `url()` references in style blocks (less/sass/scss only)
 * @returns {string[]} Resolved dependency specifiers
 */
export default function detective(content, options) {
  if (content === undefined) throw new Error('content not given');
  if (typeof content !== 'string') throw new Error('content is not a string');

  const { styles, script, scriptSetup } = parse(content, { sourceMap: false }).descriptor;
  const dependencies = [];

  for (const usedScript of [script, scriptSetup]) {
    if (!usedScript || !usedScript.content) continue;

    if (usedScript.attrs && usedScript.attrs.lang === 'ts') {
      dependencies.push(...detectiveTypeScript(usedScript.content, options));
    } else {
      dependencies.push(...detectiveEs6(usedScript.content, options));
    }
  }

  for (const style of styles) {
    switch (style.attrs.lang) {
      case 'less': {
        dependencies.push(...detectiveLess(style.content, options));
        break;
      }

      case 'sass': {
        dependencies.push(...detectiveSass(style.content, options));
        break;
      }

      case 'scss': {
        dependencies.push(...detectiveScss(style.content, options));
        break;
      }

      case 'stylus': {
        dependencies.push(...detectiveStylus(style.content));
        break;
      }

      default:
        // css has no deps
    }
  }

  return dependencies;
}
