const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');

// Show all journals in a web view
router.get('/', journal_controller.journal_view_all_Page);

// ✅ Show the journal creation form
router.get('/create', (req, res) => {
  res.render('journalform', { title: 'Create Journal' });
});

module.exports = router;
