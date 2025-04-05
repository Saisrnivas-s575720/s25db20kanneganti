const Journal = require('../models/journal');  // Import the Journal model only once

// List all Journals (JSON)
exports.journal_list = async function (req, res) {
  try {
    const journals = await Journal.find();
    res.send(journals);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Handle Journal creation on POST.
exports.journal_create_post = async function (req, res) {
  console.log(req.body);  // Log the incoming data to check the body of the request

  // Ensure the required fields are present in the body
  if (!req.body.title || !req.body.content || !req.body.author) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  // Create a new Journal document
  let document = new Journal({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });

  try {
    // Save the new journal document to the database
    let result = await document.save();
    // Return the saved document as the response
    res.status(201).send(result);  // Status 201 indicates successful creation
  } catch (err) {
    // Catch any errors during the saving process and respond with a 500 status
    res.status(500).send({ error: err.message });  // Send error message as JSON
  }
};

// Journal Details (GET by ID)
exports.journal_detail = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send({ error: "Journal not found" });
    res.send(journal);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete Journal (DELETE)
exports.journal_delete = async function (req, res) {
  try {
    const result = await Journal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ error: "Journal not found" });
    res.send({ message: "Journal deleted", deleted: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update Journal (PUT)
exports.journal_update_put = async function (req, res) {
  try {
    const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!journal) return res.status(404).send({ error: "Journal not found" });
    res.send(journal);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render View: All Journals (for journals.pug)
exports.journal_view_all_Page = async function (req, res) {
  try {
    const journals = await Journal.find();
    res.render('journals', {
      title: 'Journal Entries',
      results: journals
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
