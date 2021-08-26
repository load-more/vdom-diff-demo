const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    // 虚拟打包路径，文件夹不会真正生成，而是在8090端口虚拟生成
    publicPath: 'dist',
    // 打包生成的文件名
    filename: 'bundle.js'
  },
  devServer: {
    port: 8090, // 端口号
    contentBase: 'www' // 静态资源文件夹
  }
}