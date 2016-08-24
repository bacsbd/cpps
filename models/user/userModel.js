const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.schema({
  email: {
    type: String,
    required: true,
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

userSchema.pre('save', function(next) {
  //Sanitize Email
  this.email = validator.normalizeEmail(this.email);
  next();
});

userSchema.methods.createSalt = function() {
  return bcrypt.genSaltSync(10);
};
userSchema.methods.createHash = function(val) {
  return bcrypt.hashSync(val, 10);
};
userSchema.methods.comparePassword = function(val) {
  return bcrypt.compareSync(this.password, val);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  model: User
};
