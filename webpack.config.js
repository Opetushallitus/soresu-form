const outputDir = "./resources/public/"
const webpack = require("webpack")
const LessPluginNpmImport = require('less-plugin-npm-import')
const plugins = []

if (process.env.UGLIFY === "true") {
  const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
  })
  plugins.push(uglifyJsPlugin)
}

module.exports = {
  output: {
    path: "resources/public/js",
    filename: "soresu.js",
    library: "soresu",
    libraryTarget: "umd"
  },
  entry: {
    soresu: "./web/soresu"
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-widgets", "ReactWidgets"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: /web/,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.png$/,
        loader: "url-loader",
        query: { mimetype: "image/png" }
      },
      {
        test: /\.gif$/,
        loader: "url-loader",
        query: { mimetype: "image/gif" }
      },
      {
        include: /\.json$/,
        loaders: ["json-loader"]
      }
    ]
  },
  plugins: plugins,
  lessLoader: {
    lessPlugins: [
      new LessPluginNpmImport()
    ]
  }
}
