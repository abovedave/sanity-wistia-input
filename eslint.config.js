const {FlatCompat} = require('@eslint/eslintrc')
const js = require('@eslint/js')
const path = require('path')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

module.exports = [
  {
    ignores: ['dist/**', '*.js', 'commitlint.config.js', 'lint-staged.config.js', 'package.config.ts'],
  },
  ...compat.extends(
    'sanity',
    'sanity/typescript',
    'sanity/react',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime'
  ),
]
