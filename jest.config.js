module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|expo" +
      "|react-native-reanimated" +
      ")",
  ],
  moduleNameMapper: {
    "^expo-av$": "<rootDir>/__mocks__/expo-av.js",
  },
};
