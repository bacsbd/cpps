const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    trype: String
  }
}, {
  timestamps: true
});

mongoose.model('Notebook', noteSchema);
