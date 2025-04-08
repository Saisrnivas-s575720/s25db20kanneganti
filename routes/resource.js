const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');

// API test endpoint
router.get('/', (req, res) => {
  res.send({ message: 'API is working!' });
});

// Get all journals (GET /resource/journals)
router.get('/journals', journal_controller.journal_list);

// Get a specific journal by ID (GET /resource/journals/:id)
router.get('/journals/:id', journal_controller.journal_detail);

// Create a new journal (POST /resource/journals)
router.post('/journals', journal_controller.journal_create_post);

// Update a journal by ID (PUT /resource/journals/:id)
router.put('/journals/:id', journal_controller.journal_update_put);

// Delete a journal by ID (DELETE /resource/journals/:id)
router.delete('/journals/:id', journal_controller.journal_delete);

module.exports = router;
