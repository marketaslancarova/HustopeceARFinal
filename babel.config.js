module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // pokud používáš Reanimated nebo další natívní knihovny
      "react-native-reanimated/plugin",
    ],
  };
};
