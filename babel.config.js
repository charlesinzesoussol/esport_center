module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'expo-router/babel',
        {
          root: './app',
        },
      ],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',
            '@/components': './components',
            '@/hooks': './hooks',
            '@/types': './types',
            '@/utils': './utils',
            '@/constants': './constants',
            '@/services': './services',
          },
        },
      ],
    ],
  };
};