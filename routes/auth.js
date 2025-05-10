const express = require('express');
const router = express.Router();

// 🚪 Logout Route
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out.');
    res.redirect('/login'); // Redirect to login after logout
  });
});

module.exports = router;
