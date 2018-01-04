const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");

const { ifDev, ifProduction } = getIfUtils(process.env.NODE_ENV);

// Phaser webpack config
const phaserModule = path.join(__dirname, "/node_modules/phaser-ce/");
const phaser = path.join(phaserModule, "build/custom/phaser-split.js");
const pixi = path.join(phaserModule, "build/custom/pixi.js");
const p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
  context: path.resolve(__dirname, "./client"),
  devtool: "source-map",
  entry: {
    gameApp: "./GameApp/index.jsx",
    scoresApp: "./ScoreApp/index.jsx"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./www/dist/"),
    publicPath: "/public/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "react", "flow"],
              plugins: [
                "transform-object-rest-spread",
                "babel-plugin-transform-class-properties"
              ]
            }
          },
          "eslint-loader"
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|mp3|json)$/,
        loader: "file-loader?name=[name].[ext]"
      },
      { test: /pixi\.js/, use: ["expose-loader?PIXI"] },
      { test: /phaser-split\.js$/, use: ["expose-loader?Phaser"] },
      { test: /p2\.js/, use: ["expose-loader?p2"] }
    ]
  },
  plugins: removeEmpty([
    new ExtractTextPlugin("application.css"),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": ifProduction('"production"', '"development"'),
      "process.env.JUMP_ON": JSON.stringify(process.env.JUMP_ON)
    }),
    new FriendlyErrorsWebpackPlugin(),
    ifDev(new PrettierPlugin()),
    ifProduction(new webpack.optimize.UglifyJsPlugin())
  ]),
  resolve: {
    alias: {
      phaser,
      pixi,
      p2
    },
    extensions: [".js", ".jsx"]
  }
};
