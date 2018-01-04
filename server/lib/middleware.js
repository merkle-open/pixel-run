module.exports = function setupMiddleware(app) {
  app.use((req, res, next) => {
    res.locals.$debug = true;
    next();
  });
};
