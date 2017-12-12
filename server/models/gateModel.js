const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  // items: folder, text, problem
  type: {
    type: String,
    set: removeNullOrBlank,
    required: true,
    enum: ['folder', 'text', 'problem'],
  },
  // For children query
  parentId: {
    type: mongoose.Schema.ObjectId,
    set: removeNullOrBlank
  },
  // For subtree query
  ancestor: [mongoose.Schema.ObjectId],
  // To reorder items inside same folder
  ind: {
    type: Number,
    set: removeNullOrBlank,
  },
  title: {
    type: String,
    set: removeNullOrBlank,
    trim: true,
  },
  // Contains text body
  body: {
    type: String,
    set: removeNullOrBlank,
    trim: true,
  },
  platform: {
    type: String,
    set: removeNullOrBlank,
  },
  pid: {
    type: String,
    set: removeNullOrBlank,
    trim: true,
  },
  // Link for problem or text
  link: {
    type: String,
    set: removeNullOrBlank,
    trim: true,
  },
  // Stores the userID who solved the problem
  doneList: [String],
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

schema.statics.getRoot = function() {
  return mongoose.Types.ObjectId('000000000000000000000000'); // eslint-disable-line
};

/**
 * Deals with "createdBy" and "updatedBy"
 */
schema.pre('save', function(next, req) {
  if ( !req.session ) {
    return next();
  }

  // only admins are allowed in here
  if ( req.session.status == 'user' ) {
    return next();
  }

  const doc = this;

  // Don't update when doneList gets changed
  if ( this.isNew === false && doc.isModified('doneList')) {
    return next();
  }

  if (!doc.createdBy) doc.createdBy = req.session.username;
  doc.lastUpdatedBy = req.session.username;
  return next();
});

mongoose.model('Gate', schema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
