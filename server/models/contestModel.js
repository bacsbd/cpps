const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: removeNullOrBlank,
    trim: true,
  },
  link: {
    type: String,
    set: removeNullOrBlank,
    trim: true,
  },
  classroomId: {
    type: ObjectId,
    ref: 'Classroom',
  },
  coach: {
    type: ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

mongoose.model('Contest', contestSchema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
