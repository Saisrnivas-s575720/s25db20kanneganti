const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Journal", journalSchema);
