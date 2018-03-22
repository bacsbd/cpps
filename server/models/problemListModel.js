const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
    set: removeNullOrBlank,
    trim: true,
  },
  createdBy: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  problems: [{
    platform: String,
    problemId: String,
    title: String,
    link: String,
  }],
  sharedWith: {
    type: [{type: ObjectId, ref: 'Classroom'}],
    default: [],
  },
}, {
  timestamps: true,
});


mongoose.model('ProblemList', schema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
