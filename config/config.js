module.exports = function (app, express) {
  var auth = require('connect-auth');

  app.configure(function () {
    app.set('views', 'views');
    app.set('view engine', 'jade');

    app.use(express.bodyDecoder());
    app.use(express.cookieDecoder());
    app.use(express.session({
      store: require('connect-mongodb')({maxAge: 60 * 60 * 1000}),
      secret: 'jimi-henrix_and_john-coltrane_jamming_in_a_train'
    }));

    app.use(express.methodOverride());

    // Get rid of that if one day they merge my pull request to "autocompile"
    app.use(require('../ext/connect/compiler.js')({src: 'public/stylesheets', dest: 'public', enable: ['less'], autocompile: true}));
    app.use(express.staticProvider('public'));

    app.use(auth([require('../models/auth')(app).formStrategy()]));

    app.use(app.router);
  });
};
