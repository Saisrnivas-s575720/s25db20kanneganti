const Journal = require('../models/journal');

// List all Journals (JSON)
exports.journal_list = async function (req, res) {
  try {
    const journals = await Journal.find();
    res.send(journals);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create Journal (POST)
exports.journal_create_post = async function (req, res) {
  try {
    const journal = new Journal({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });

    const result = await journal.save();
    res.status(201).send(result); // 201 Created
  } catch (err) {
    res.status(500).send({ error: err.message });
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
