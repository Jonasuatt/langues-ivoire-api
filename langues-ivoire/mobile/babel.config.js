module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Note: react-native-reanimated v4 ne nécessite plus de plugin Babel
  };
};
