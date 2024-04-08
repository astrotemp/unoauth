import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginA11y from 'eslint-plugin-jsx-a11y'
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginA11y.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
];
