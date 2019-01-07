module.exports = {
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-regenerator',
    [
      {
        helpers: false,
        regenerator: true,
      },
    ],
  ],
  presets: [
    '@babel/preset-env',
    'module:metro-react-native-babel-preset',
    '@babel/preset-react',
    '@babel/typescript',
  ],
};
