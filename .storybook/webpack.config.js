const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'babel-loader',
    include: path.join(__dirname, '../src'),
  })
  config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx')
  config.plugins.push(new ForkTsCheckerWebpackPlugin());

  return config
}
