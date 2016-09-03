const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  /// items: folder, text, problem
  type: {
    type: String,
    set: removeNullOrBlank,
    required: true,
    enum: ['folder', 'text', 'problem']
  },
  /// For children query
  parentId: {
    type: mongoose.Schema.ObjectId,
    set: removeNullOrBlank,
    required: true
  },
  /// For subtree query
  ancestor: [mongoose.Schema.ObjectId],
  ///To reorder items inside same folder
  ind: {
    type: Number,
    set: removeNullOrBlank
  },
  title: {
    type: String,
    set: removeNullOrBlank,
    trim: true
  },
  /// Contains text body
  body: {
    type: String,
    set: removeNullOrBlank,
    trim: true
  },
  platform: {
    type: String,
    set: removeNullOrBlank
  },
  pid: {
    type: String,
    set: removeNullOrBlank,
    trim: true
  },
  /// Link for problem or text
  link: {
    type: String,
    set: removeNullOrBlank,
    trim: true
  },
  doneList: [mongoose.Schema.ObjectId] ///Stores the userID who solved the problem
}, {
  timestamps: true
});

mongoose.model('Gate', schema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
