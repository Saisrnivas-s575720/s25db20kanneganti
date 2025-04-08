const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');

// Show all journals in a web view
router.get('/', journal_controller.journal_view_all_Page);

// Show form to create a new journal
router.get('/create', (req, res) => {
  res.render('journalform', { title: 'Create Journal' });
});

// Handle journal creation
router.post('/create', journal_controller.journal_create_post);

// Show form to update a journal
router.get('/:id/update', journal_controller.journal_update_get);

// Handle update form submission
router.post('/:id/update', journal_controller.journal_update_post);

// Show delete confirmation view
router.get('/:id/delete', journal_controller.journal_delete_get);

// Handle delete form submission
router.delete('/:id', journal_controller.journal_delete);

// Optional: View single journal detail (JSON or render)
router.get('/:id', journal_controller.journal_detail);

module.exports = router;
