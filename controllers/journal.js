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

// POST new journal (JSON or HTML form)
exports.journal_create_post = async function (req, res) {
  try {
    const { title, content } = req.body;
    const authorId = req.user ? req.user._id : req.body.author;

    if (!title || !content || !authorId) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const document = new Journal({ title, content, author: authorId });
    const result = await document.save();

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('success', 'Journal created successfully!');
      res.redirect('/journals/list');
    } else {
      res.status(201).send(result);
    }
  } catch (err) {
    console.error("❌ Journal creation error:", err);
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      res.render('journalform', {
        title: 'Create Journal',
        error: err.message
      });
    } else {
      res.status(500).send({ error: err.message });
    }
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

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      req.flash('success', 'Journal deleted successfully!');
      res.redirect('/journals/list');
    } else {
      res.send({ message: "Journal deleted", deleted: result });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// -------------------- WEB VIEW CONTROLLERS -------------------- //

// Render: list of journals
exports.journal_view_all_Page = async function (req, res) {
  try {
    const journals = await Journal.find().populate('author');
    res.render('journals', {
      title: 'Journal Entries',
      results: journals
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render: single journal by ?id=...
exports.journal_view_one_Page = async function (req, res) {
  try {
    const id = req.query.id;
    if (!id) {
      req.flash('error', 'Missing journal ID.');
      return res.redirect('/journals/list');
    }

    const journal = await Journal.findById(id).populate('author');
    if (!journal) {
      return res.render('journaldetail', {
        title: 'Journal Detail',
        journal: null,
        error: 'Journal not found.'
      });
    }

    res.render('journaldetail', {
      title: 'Journal Detail',
      journal: journal
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render: create form
exports.journal_create_page = function (req, res) {
  try {
    res.render('journalform', { title: 'Create Journal' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render: update form
exports.journal_update_get = async function (req, res) {
  try {
    const id = req.params.id.trim();
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.render('journalupdate', {
        title: 'Edit Journal',
        journal: null,
        error: 'Journal not found.'
      });
    }

    res.render('journalupdate', {
      title: 'Edit Journal',
      journal: journal
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// POST: update journal via HTML form
exports.journal_update_post = async function (req, res) {
  try {
    const journalId = req.params.id.trim();
    const journalToUpdate = await Journal.findById(journalId);

    if (!journalToUpdate) {
      req.flash('error', 'Journal not found.');
      return res.redirect('/journals/list');
    }

    const authorId = req.user ? req.user._id : journalToUpdate.author;

    const updatedJournal = await Journal.findByIdAndUpdate(
      journalId,
      {
        title: req.body.title,
        content: req.body.content,
        author: authorId
      },
      { new: true, runValidators: true }
    );

    req.flash('success', 'Journal updated successfully!');
    res.redirect('/journals/list');
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Render: delete confirmation
exports.journal_delete_get = async function (req, res) {
  try {
    const journal = await Journal.findById(req.params.id.trim());
    if (!journal) {
      req.flash('error', 'Journal not found.');
      return res.redirect('/journals/list');
    }

    res.render('journaldelete', { title: 'Delete Journal', journal: journal });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
