module.exports = function (app) {
  var render = function (options) {
        return {
          locals: Object.merge({
            title: GLOBAL.APP_NAME
          }),
          layout: 'public'
        };
      };

  app.get('', function (req, res) {
    res.render('public/index', render());
  });

  app.get('/public/users/login', function (req, res) {
    res.render('public/users/login', render({
      email: null,
      password: null
    }));
  });

  app.get('/public/users/new', function (req, res) {
    res.render('public/users/new', render({
      user: null,
      validator: null
    }));
  });

  app.post('/public/users/new', function (req, res) {
    var User = app.model('user'),
        user = req.param('user');

    User.createInstance(user, function (error, validator) {
      if (!validator.hasErrors()) {
        res.redirect('/public/users/activate_your_account/' + validator.updated_model._id.toHexString());
      } else {
        res.render('public/users/new', render({
          user: validator.updated_model,
          validator: validator
        }));
      }
    });
  });

  app.get('/public/users/activate_your_account/:user_id', function (req, res) {
    var User = app.model('user');

    User.mongoCall('findOne', {'_id': GLOBAL.OBJECTID.createFromHexString(req.param('user_id'))}, function (error, user) {
      res.render('public/users/activate', render({
        user: user
      }));
    });
  });

  app.get('/public/users/activate/:activate_code', function (req, res) {
    var User = app.model('user');

    // we log in the user after activation
    req.authenticate(['form'], function (error, authenticated) {
      res.redirect('/users/welcome/');
    });
  });
};
