const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email not valid'
    },
    maxlength: 256
  },
  students: [{
    id: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  name: {
    type: String,
    require: true,
    maxlength: 20
  }
})

mongoose.model('classRoom', classSchema);
