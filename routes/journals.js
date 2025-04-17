const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');

// ✅ List view - SHOW ALL JOURNALS (web page)
router.get('/list', journal_controller.journal_view_all_Page); // 🔥 Make sure this is before any dynamic route

// ✅ Journal create form (GET) and submit (POST)
router.get('/create', journal_controller.journal_create_page);
router.post('/create', journal_controller.journal_create_post);

// ✅ Detail page by query (?id=...)
router.get('/detail', journal_controller.journal_view_one_Page);

// ✅ Edit form + update
router.get('/:id/edit', journal_controller.journal_update_get);
router.get('/:id/update', journal_controller.journal_update_get);
router.post('/:id/update', journal_controller.journal_update_post);

// ✅ Delete form (GET) and delete (DELETE)
router.get('/:id/delete', journal_controller.journal_delete_get);
router.delete('/:id', journal_controller.journal_delete);

// ✅ Default route - redirect to /list or show all
router.get('/', (req, res) => {
  res.redirect('/journals/list');
});

// ✅ REST API route for single journal by ID (JSON)
router.get('/:id', journal_controller.journal_detail);

module.exports = router;

module.exports = router;
