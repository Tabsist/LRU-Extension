const path = require('path');

module.exports = {
  entry: './src/content_script/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main.js'
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/,
      options: {
        presets: [
          ['@babel/preset-env', { targets: "defaults" }],
          ['@babel/preset-react', {"runtime": "automatic"}]
        ]
      }
    },
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    }
  
  ]
  },
  devtool:"cheap-module-source-map"
};
