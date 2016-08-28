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
    validator: {
      validate: matchSlug,
      message: 'Small letters, digits and hyphens only'
    }
  },
  body: {
    trype: String
  }
}, {
  timestamps: true
});

mongoose.model('Notebook', noteSchema);

function matchSlug(val) {
  const re = /a-z0-9\-+/;
  return re.test(val);
}
