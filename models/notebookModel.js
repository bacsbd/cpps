const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: matchSlug,
      message: 'Invalid Slug - Small letters, digits and hyphens only'
    }
  },
  body: {
    type: String
  },
  createdBy: {
    type: String,
    required: true
  },
  lastUpdatedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

mongoose.model('Notebook', noteSchema);

function matchSlug(val) {
  const re = new RegExp('a-z0-9-+');
  return re.test(val);
}
