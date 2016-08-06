module.exports = {
    entry: {
      product: ['./scripts/product.js'],
      store: ['./scripts/store.js']
    },
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
