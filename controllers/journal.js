const Journal = require('../models/journal');

// -------------------- RESTful API CONTROLLERS -------------------- //

// GET all journals (JSON)
exports.journal_list = async function (req, res) {
  try {
    const journals = await Journal.find();
    res.send(journals);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET one journal by ID (JSON)
exports.journal_detail = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id.trim());
    if (!journal) return res.status(404).send({ error: "Journal not found with given ID." });
    res.send(journal);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// POST new journal (JSON or Form)
exports.journal_create_post = async function (req, res) {
  if (!req.body.title || !req.body.content || !req.body.author) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const document = new Journal({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });

  try {
    const result = await document.save();
    if (req.headers.accept.includes('text/html')) {
      res.redirect('/journals');
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// PUT update journal by ID (JSON)
exports.journal_update_put = async function (req, res) {
  try {
    const journal = await Journal.findByIdAndUpdate(req.params.id.trim(), req.body, {
      new: true,
      runValidators: true
    });

    if (!journal) return res.status(404).send({ error: "Journal not found with given ID." });

    res.send(journal);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// DELETE journal by ID (JSON or HTML)
exports.journal_delete = async function (req, res) {
  try {
    const result = await Journal.findByIdAndDelete(req.params.id.trim());
    if (!result) return res.status(404).send({ error: "Journal not found" });

    if (req.headers.accept.includes('text/html')) {
      res.redirect('/journals');
    } else {
      res.send({ message: "Journal deleted", deleted: result });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// -------------------- WEB VIEW CONTROLLERS -------------------- //

// Render: list of journals (HTML)
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

// Render: journal update form (HTML)
exports.journal_update_get = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id.trim());
    if (!journal) return res.status(404).send({ error: "Journal not found" });

    res.render('journalupdate', { title: 'Edit Journal', journal: journal });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// POST: update journal via HTML form
exports.journal_update_post = async function (req, res) {
  try {
    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id.trim(),
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

// Render: delete confirmation page (HTML)
exports.journal_delete_get = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id.trim());
    if (!journal) return res.status(404).send({ error: "Journal not found" });

    res.render('journaldelete', { title: 'Delete Journal', journal: journal });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
