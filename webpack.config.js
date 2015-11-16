
module.exports = {
  module: {
    loaders: [
        {include: /\.json$/, loaders: ["json-loader"]},
        {test: require.resolve("./lib/index"), loader: "expose?index" }
    ]
  },
  resolve: {
    extensions: ['', '.json', '.jsx', '.js']
  },
  node: {
    net: "empty",
    tls: "empty",
    fs: 'empty'
  }
}
