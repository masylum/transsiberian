module.exports = function (app) {

  app.post('/auth/form', function (req, res) {
    var self = this,
        User = app.model('user'),
        failed_authentication = function () {
          req.flash('error', 'Incorrect user/password');
          res.redirect('/public/users/login/');
        };

    req.authenticate(['form'], function (error, authenticated) {
      if (authenticated) {
        User.mongoCall('findOne', {_id: GLOBAL.OBJECTID.createFromHexString(req.session.auth.user._id)}, function (errors, user) {
          res.redirect('/users/dashboard/');
        });
      } else {
        failed_authentication();
      }
    });
  });

  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.writeHead(303, { 'Location': "/" });
    res.end('');
  });

};
