const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' })
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' })
};

// registration middleware
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That email is not valid!').isEmail();
  req.checkBody('password', 'Password cannot be Black!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password cannot be Black!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your password do not match').equals(req.body.password);

  const errors = req.getValidationResult();

  errors.then((result) => {
    if (!result.isEmpty()) {
      req.flash('error', result.array().map(err => err.msg));
      res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    } else {
      next();
    }
  });
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};
