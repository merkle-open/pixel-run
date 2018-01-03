exports = module.exports = function(app) {
  app.use((req, res, next) => {
    res.locals.$debug = true;
    next();
  });
};
