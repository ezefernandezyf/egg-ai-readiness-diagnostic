// ESLint 9 flat config — minimal base
export default [
  {
    ignores: ['**/dist/', '**/node_modules/', '**/*.js', '**/*.mjs'],
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
