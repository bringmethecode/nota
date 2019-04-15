/* eslint-disable no-new */
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader'
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.json']
  },
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map'
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
    config.devServer = {
      port: 3000,
      publicPath: '/dist/',
      hotOnly: true,
    }
  }

  if (argv.mode === 'production') {
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          cache: true,
          sourceMap: true,
          parallel: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
    }
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]

    if (process.env.ANALYZER === 'true') {
      config.plugins = [
        ...config.plugins,
        new BundleAnalyzerPlugin()
      ]
    }
    config.node = {
      __dirname: false,
      __filename: false
    }
  }

  return config
}
