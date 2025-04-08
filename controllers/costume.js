const Costume = require('../models/costume');

// List all Costumes
// List of all Costumes
exports.costume_list = async function(req, res) {
    try {
      const theCostumes = await Costume.find();
      res.send(theCostumes); // Respond with all costume documents
    } catch (err) {
      res.status(500);
      res.send({ error: err.message });
    }
  };
  

// Costume details by ID
exports.costume_detail = async function(req, res) {
  try {
    const costume = await Costume.findById(req.params.id);
    res.send(costume);
  } catch (err) {
    res.status(500).send(`Error finding costume: ${err}`);
  }
};

// Create a Costume
exports.costume_create_post = async function(req, res) {
  try {
    const costume = new Costume(req.body);
    const result = await costume.save();
    res.send(result);
  } catch (err) {
    res.status(500).send(`Error creating costume: ${err}`);
  }
};
exports.costume_view_all_Page = async function(req, res) {
    try{
    theCostumes = await Costume.find();
    res.render('costumes', { title: 'Costume Search Results', results: theCostumes });
    }
    catch(err){
    res.status(500);
    res.send(`{"error": ${err}}`);
    }
   };
   var express = require('express');
var router = express.Router();
const costume_controller = require('../controllers/costume');

// Page that displays all costumes
router.get('/', costume_controller.costume_view_all_Page);

module.exports = router;


// Delete a Costume by ID
exports.costume_delete = async function(req, res) {
  try {
    const result = await Costume.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(500).send(`Error deleting costume: ${err}`);
  }
};

// Update a Costume by ID
exports.costume_update_put = async function(req, res) {
  try {
    const costume = await Costume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(costume);
  } catch (err) {
    res.status(500).send(`Error updating costume: ${err}`);
  }
};
