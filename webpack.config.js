
module.exports = {
  module: {
    loaders: [
        {include: /\.json$/, loaders: ["json-loader"]}
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
