const { postcss } = require("tailwindcss");
const path = require("path");
const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  output: {
    publicPath: "./",
  },
  // Add this for hot reload
  devServer: {
    hot: true,
    port: 3000,
  },
  // Enable source maps for better debugging
  devtool: "eval-source-map",
};
