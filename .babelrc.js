module.exports = {
  compact: false,
  presets: [
    [
      '@babel/preset-env', // https://babeljs.io/docs/en/babel-preset-env
      {
        modules: false, // for tree shaking
        loose: true,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
  ],
};
