/* eslint-disable global-require */
const enableAutoPrefixer = true;
const enabledSourceMap = process.env.NODE_ENV === 'development';
const minimize = !enabledSourceMap;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// https://babeljs.io/docs/en/options
const babelLoaderOptions = {
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

const scssRuleUse = [
  !minimize
    ? {
        loader: 'style-loader',
      }
    : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap: enabledSourceMap,
      importLoaders: 2,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: enabledSourceMap,
      plugins: [
        require('autoprefixer')({
          grid: true,
        }),
      ],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: enabledSourceMap,
    },
  },
];
if (!enableAutoPrefixer) {
  scssRuleUse[1].options.importLoaders = 1; // css-loader's options
  scssRuleUse.splice(2, 1); // remove postcss-loader
}

let rules = [
  {
    test: /\.(js|jsx)$/,
    use: [
      {
        loader: 'thread-loader',
        options: {
          workers: 4,
          name: 'js-thread-loader-pool',
        },
      },
      {
        loader: 'babel-loader?cacheDirectory=true',
        // options: babelLoaderOptions, //see .babelrc.js, [useBuiltIns: "usage"] bugged in loader's options
      },
    ],
  },
  {
    test: /\.css$/,
    use: scssRuleUse,
  },
  {
    test: /\.(sa|sc)ss$/,
    use: scssRuleUse,
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/images/',
        },
      },
    ],
  },
  {
    test: /\.(eot|wof|woff|woff2|ttf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/',
        },
      },
    ],
  },
  {
    test: /\.html$/,
    use: {
      loader: 'html-loader',
      options: {
        attrs: ['img:src', ':data-src'],
        minimize,
      },
    },
  },
];

if (enabledSourceMap) {
  rules = rules.concat([
    {
      test: /\.(js|jsx)$/,
      enforce: 'pre',
      exclude: /node_modules/,
      use: [
        {
          loader: 'eslint-loader',
        },
      ],
    },
  ]);
}

module.exports = rules;
