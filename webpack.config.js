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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
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
    config.plugins = [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      ...config.plugins
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
    config.plugins = [
      new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
        chunkFilename: '[id]-[hash].css',
      }),
      ...config.plugins,
      ...(process.env.ANALYZER === 'true' ? new BundleAnalyzerPlugin({
        analyzerMode: 'server',
      }) : [])
    ]
    config.node = {
      __dirname: false,
      __filename: false
    }
  }

  return config
}
