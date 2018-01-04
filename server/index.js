const http = require("http");
const express = require("express");
const chalk = require("chalk");
require("dotenv").config();

console.log(
  [
    `Starting Server in ${chalk.green("%s")} mode`,
    `Open up ${chalk.green("http://%s:%d/")} in your browser`,
    ""
  ].join("\n"),
  process.env.NODE_ENV,
  process.env.HOST,
  process.env.PORT
);

// Create a new express instance
const app = express();

// Adding general setup stuff for views, router etc.
require("./lib/setup")(app);

// Apply some new middleware for preloading
require("./lib/middleware")(app);

// Attach all routes and routing stuff
app.use("/", require("./router"));

// Loading the error handlers
require("./lib/error")(app);

// Setting the port to environement port or 3000
const port = process.env.port || process.env.PORT || "3000";
app.set("port", port);

// Starts a http server with the express app
const server = http.createServer(app);
server.listen(port);
