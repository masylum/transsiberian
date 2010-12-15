module.exports = function User(db, app) {
  var user = require('mongolia').model(db, 'users');

  user.validate = function (user, data, callback) {
    var validator = require('mongolia').validator(user, data);

    validator.validateRegex({
      name: [validator.regex.username, 'Incorrect name'],
      email: [validator.regex.email, 'Incorrect email'],
      password: [validator.regex.password, 'Incorrect password']
    });

    if (validator.attrChanged('password')) {
      validator.validateConfirmation({
        'password': ['password_confirmation', 'Passwords must match']
      });
    }

    validator.validateQuery({
      name: [this, {name: data.name}, false, 'There is already a user with this name'],
      email: [this, {email: data.email}, false, 'There is already a user with this email']
    }, function () {
      callback(null, validator);
    });
  };

  user.onCreate = function (element) {
    var auth = require('../auth')(app);

    auth.generateAuth(element);
    element.created_at    = new Date();
    element.is_deleted    = false;
    element.last_login_at = null;
    element.updated_at    = null;
    element.roles         = [];
  };

  user.afterCreate = function (element) {
  };

  user.getCurrent = function (req, res, callback) {
    if (req.session.auth.user && req.session.auth.user._id) {
      this.mongoCall('findOne', GLOBAL.OBJECTID.createFromHexString(req.session.auth.user._id), function (error, user) {
        if (user) {
          callback(null, user);
        } else {
          req.flash('error', "We couldn't find your user account");
          res.redirect('/public/users/login/');
        }
      });
    } else {
      req.flash('error', "Please, login");
      res.redirect('/public/users/login/');
    }
  };

  return user;
};

