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

// Render view to list journals
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

// Show journal detail (JSON)
exports.journal_detail = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send({ error: "Journal not found" });
    res.send(journal);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Show form to update a journal
exports.journal_update_get = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send({ error: "Journal not found" });
    res.render('journalupdate', { title: 'Edit Journal', journal: journal });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Handle update POST from form
exports.journal_update_post = async function (req, res) {
  try {
    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
      },
      { new: true, runValidators: true }
    );

    if (!updatedJournal) return res.status(404).send({ error: "Journal not found" });

    res.redirect('/journals');
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Show form to confirm delete
exports.journal_delete_get = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send({ error: "Journal not found" });
    res.render('journaldelete', { title: 'Delete Journal', journal: journal });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Handle DELETE (via method override)
exports.journal_delete = async function (req, res) {
  try {
    const result = await Journal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ error: "Journal not found" });
    res.redirect('/journals');
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
// API: Handle PUT update for a journal (JSON)
exports.journal_update_put = async function (req, res) {
  try {
    const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!journal) {
      return res.status(404).send({ error: 'Journal not found' });
    }

    res.send(journal);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


// Handle journal creation
exports.journal_create_post = async function (req, res) {
  if (!req.body.title || !req.body.content || !req.body.author) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  let document = new Journal({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });

  try {
    let result = await document.save();
    res.redirect('/journals');
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
