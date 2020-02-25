const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less?$/,
        use: [          
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|oft)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: /node_modules/
      },
    ]
  },
  devServer: { // 配置webpack-dev-server， 在本地启动一个服务器运行
    host: 'localhost', // 服务器的ip地址 希望服务器外可以访问就设置 0.0.0.0
    port: 8082, // 端口
    open: true, // 自动打开页面
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve('/dist/index.html'), // 生成的html文件存放的地址和文件名
      template: resolve("/index.html"), // 基于index.html模板进行生成html文件
    }),
  ]
};