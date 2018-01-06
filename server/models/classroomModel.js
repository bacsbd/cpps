const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    set: removeNullOrBlank,
    required: true,
  },
  coach: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  students: [{type: Schema.Types.ObjectId, ref: 'User'}],
}, {
  timestamps: true,
});

mongoose.model('Classroom', classroomSchema);

/*
 * Implementation
 */

function removeNullOrBlank(data) {
  if (data === null || data === '') return undefined;
  return data;
}
