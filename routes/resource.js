const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');
const api_controller = require('../controllers/api');

// API base test endpoint
router.get('/', api_controller.api);

// JOURNAL routes
router.get('/journals', journal_controller.journal_list);
router.get('/journals/:id', journal_controller.journal_detail);

// ✅ POST request to create new Journal
router.post('/journals', (req, res, next) => {
  console.log("✅ Received POST to /resource/journals");
  next();
}, journal_controller.journal_create_post);

router.put('/journals/:id', journal_controller.journal_update_put);
router.delete('/journals/:id', journal_controller.journal_delete);

module.exports = router;
