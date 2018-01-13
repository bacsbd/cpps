const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: removeNullOrBlank,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    set: removeNullOrBlank,
    trim: true,
  },
  standings: [{
    username: {
      type: String,
      required: true,
      set: removeNullOrBlank,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
      set: removeNullOrBlank,
    },
    previousRating: {
      type: Number,
      required: true,
      set: removeNullOrBlank,
    },
    newRating: {
      type: Number,
      required: true,
      set: removeNullOrBlank,
    },
  }],
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
contestSchema.pre('save', function(next, req) {
  if ( !req.session ) {
    return next();
  }

  // only admins are allowed in here
  if ( req.session.status == 'user' ) {
    return next();
  }

  const doc = this;

  if (!doc.createdBy) doc.createdBy = req.session.username;
  doc.lastUpdatedBy = req.session.username;
  return next();
});

mongoose.model('Contest', contestSchema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
