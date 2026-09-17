/**
 * Declares the bundled Google Font so `npx react-native-asset` copies the files
 * into the native projects.
 */
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts'],
};
