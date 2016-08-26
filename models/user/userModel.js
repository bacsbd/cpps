const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 256
  },
  status: {
    type: String,
    required: true,
    default: 'user',
    enum: ['root', 'admin', 'user']
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  verificationValue: {
    type: String
  }
}, {
  timestamps: true
});

userSchema.statics.createSalt = function() {
  return bcrypt.genSaltSync(10);
};
userSchema.statics.createHash = function(val) {
  return bcrypt.hashSync(val, 10);
};
userSchema.methods.comparePassword = function(val) {
  return bcrypt.compareSync(val, this.password);
};
userSchema.statics.normalizeEmail = validator.normalizeEmail;

mongoose.model('User', userSchema);
