module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
  ],
  overrides: [
    {
      files: ['src/*.ts', 'src/*.js'],
    },
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'require-jsdoc': 'off',
    'semi': 0,
    'operator-linebreak': 'off',
    'no-explicit-any': 0,
  },
};
