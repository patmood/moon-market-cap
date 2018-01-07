const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.html',
  }),
  new CopyWebpackPlugin([{ from: 'static' }]),
  new ExtractTextPlugin({
    filename: './bundle.css',
    allChunks: true,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
]

module.exports = function webpackStuff(env) {
  if (env === 'production') plugins.push(new MinifyPlugin())

  return {
    entry: ['./src/index.js', './styles/app.css'],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      contentBase: './dist',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015'],
            plugins: [],
          },
          exclude: /node_modules/,
          include: [path.resolve(__dirname, './')],
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              'css-loader?importLoaders=1',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: loader => [
                    require('postcss-import')({ root: loader.resourcePath }),
                    require('postcss-cssnext')(),
                    require('cssnano')(),
                  ],
                },
              },
            ],
          }),
        },
      ],
    },
    plugins,
  }
}
