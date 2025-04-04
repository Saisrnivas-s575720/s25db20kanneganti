var express = require('express');
var router = express.Router();

/* GET journals page. */
router.get('/', function(req, res, next) {
  res.render('journals', { title: 'Search Results: Journals' });
});

module.exports = router;
