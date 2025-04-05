const express = require('express');
const router = express.Router();
const journal_controller = require('../controllers/journal');

// API test
router.get('/', (req, res) => {
  res.send({ message: 'API is working!' });
});

// Journal routes
router.get('/journals', (req, res, next) => {
  console.log('✅ GET /resource/journals');  // Debug log
  next();  // Pass control to journal_list
}, journal_controller.journal_list);

router.get('/journals/:id', (req, res, next) => {
  console.log('✅ GET /resource/journals/:id');  // Debug log
  next();  // Pass control to journal_detail
}, journal_controller.journal_detail);

router.post('/journals', (req, res, next) => {
  console.log('✅ POST to /resource/journals');  // Debug log
  next();  // Pass control to journal_create_post
}, journal_controller.journal_create_post);

router.put('/journals/:id', (req, res, next) => {
  console.log('✅ PUT /resource/journals/:id');  // Debug log
  next();  // Pass control to journal_update_put
}, journal_controller.journal_update_put);

router.delete('/journals/:id', (req, res, next) => {
  console.log('✅ DELETE /resource/journals/:id');  // Debug log
  next();  // Pass control to journal_delete
}, journal_controller.journal_delete);

module.exports = router;
