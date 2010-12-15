module.exports = function (app, express) {
  app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
  });

  app.configure('production', function () {
    app.use(express.errorHandler());
    app.use(express.compiler({src: '../public', enable: ['less'], autocompile: false}));
  });
};
