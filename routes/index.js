const express = require('express');
const passport = require('passport');
const router = express.Router();
const Account = require('../models/account');

// ✅ Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Journal App' });
});

// ✅ Register form
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', message: null });
});

// ✅ Handle register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await Account.findOne({ username });
    if (existingUser) {
      return res.render('register', {
        title: 'Register',
        message: 'User already exists'
      });
    }

    const newAccount = new Account({ username });
    await Account.register(newAccount, password);
    res.redirect('/');
  } catch (err) {
    res.render('register', {
      title: 'Register',
      message: 'Registration failed'
    });
  }
});

// ✅ Login form
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    message: req.flash('error') // for showing login failure messages
  });
});

// ✅ Handle login + return to intended page
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    const returnTo = req.session.toReturn || '/';
    delete req.session.toReturn;
    res.redirect(returnTo);
  }
);

// ✅ Handle logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// ✅ Optional: Test route to confirm server health
router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;
