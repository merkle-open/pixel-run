const hbs = require("hbs");
const path = require("path");
const pollution = require("hpp");
const logger = require("morgan");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const hbutils = require("hbs-utils")(hbs);
const cookieParser = require("cookie-parser");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("../../webpack.config.js");

const isDev = process.env.NODE_ENV !== "production";
const base = path.join(__dirname, "..", "..", "www");

module.exports = function setupApp(app) {
  // Webpack for development
  if (isDev) {
    const compiler = webpack(webpackConfig);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        // use friendly-errors-webpack-plugin for logging
        quiet: true
      })
    );
  }

  // Registering partials
  hbutils.registerWatchedPartials(path.join(base, "components"));

  // Defining views and templates
  app.set("views", [path.join(base, "views"), path.join(base, "templates")]);

  // View-engine setup
  app.set("view engine", "hbs");
  app.engine("hbs", hbs.__express);
  app.set("view options", {
    layout: "default"
  });

  // Security settings
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(pollution());

  // Parser and static-dir settings
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use("/public", express.static(path.join(base, "dist")));
};
