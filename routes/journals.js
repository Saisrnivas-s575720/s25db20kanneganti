const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');

//  Authentication middleware with flash message
function secured(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page.'); //  Add this
  req.session.toReturn = req.originalUrl;
  res.redirect("/login");
}

//  Web Page Routes

// Redirect /journals → /journals/list
router.get('/', (req, res) => {
  res.redirect('/journals/list');
});

// Public Routes
router.get('/list', journal_controller.journal_view_all_Page);
router.get('/detail', journal_controller.journal_view_one_Page);

// Protected Create Routes
router.get('/create', secured, journal_controller.journal_create_page);
router.post('/create', secured, journal_controller.journal_create_post);

// Protected Update Routes
router.get('/:id/edit', secured, journal_controller.journal_update_get);
router.get('/:id/update', secured, journal_controller.journal_update_get);
router.post('/:id/update', secured, journal_controller.journal_update_post);

// Protected Delete Routes
router.get('/:id/delete', secured, journal_controller.journal_delete_get);
router.delete('/:id', secured, journal_controller.journal_delete);

// 🔁 REST API Route (keep this last)
router.get('/:id', journal_controller.journal_detail);

module.exports = router;
