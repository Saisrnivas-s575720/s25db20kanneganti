var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const query = req.query;
  console.log(`rows ${query.rows}`);
  console.log(`cols ${query.cols}`);
  res.render('grid', {
    title: 'Grid Display',
    query: query
  });
});

module.exports = router;
