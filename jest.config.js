module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Several runtime dependencies ship untranspiled ESM, so they must go through
  // Babel rather than being ignored like the rest of node_modules.
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(' +
      '(jest-)?react-native|@react-native(-community)?|@react-native-[^/]+|' +
      '@react-navigation|react-native-[^/]+|react-freeze|nanoid|@shopify/flash-list|@faker-js/faker' +
      ')/)',
  ],
};
