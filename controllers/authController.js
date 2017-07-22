const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out!');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  req.flash('error', 'Oops! You must be logged in!');
  res.redirect('/login');
};