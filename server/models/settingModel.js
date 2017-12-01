const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    // required: true enforced by system
  },
  lastUpdatedBy: {
    type: String,
    // required: true enforced by system
  },
}, {
  timestamps: true,
});

/**
 * Deals with "createdBy" and "updatedBy"
 */
schema.pre('save', function(next, req) {
  const doc = this;
  if (!doc.createdBy) doc.createdBy = req.session.username;
  doc.lastUpdatedBy = req.session.username;
  return next();
});

mongoose.model('Setting', schema);
