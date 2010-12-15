module.exports = function (app) {
  var user = app.model('user'),
      authenticate = function (req, res, next) {
        user.getCurrent(req, res, function (error, user) {
          if (user) {
            req.user = user;
            next();
          } else {
            next(new Error(error));
          }
        });
      },

      render = function (options) {
        return Object.merge({
          title: GLOBAL.APP_NAME,
          layout: 'private'
        }, options);
      };

  app.get('/users/welcome', authenticate, function (req, res) {
    res.render('users/welcome', render({
      user: req.user
    }));
  });

  app.get('/users/dashboard', authenticate, function (req, res) {
    res.render('users/dashboard', render({
      user: req.user
    }));
  });

  app.get('/users/edit', authenticate, function (req, res) {
    res.render('users/edit', render({
      title: 'Edit profile',
      user: req.user,
      validator: null
    }));
  });

  app.post('/users/edit', authenticate, function (req, res) {
    var p_user = req.param('user');

    if (p_user && !p_user.password) {
      delete p_user.password;
      delete p_user.password_confirmation;
    }

    user.updateInstance(req.advertiser, p_user, function (error, validator) {
      res.render('users/edit', render({
        title: 'Edit profile',
        user: validator.updated_model,
        validator:  validator
      }));
    });
  });
};

