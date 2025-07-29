module.exports = {
  extends: ['react-app', 'react-app/jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Disable some rules that might cause issues
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
