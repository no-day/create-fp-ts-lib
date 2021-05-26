module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'id-length': ['error', { min: 1, max: 20 }],
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
