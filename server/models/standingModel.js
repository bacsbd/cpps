const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const standingSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  position: {
    type: Number,
    required: true,
    set: removeNullOrBlank,
  },
  contestId: {
    type: ObjectId,
    ref: 'Contest',
    required: true,
  },
  classroomId: {
    type: ObjectId,
    ref: 'Classroom',
    required: true,
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
}, {
  timestamps: true,
});

mongoose.model('Standing', standingSchema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
