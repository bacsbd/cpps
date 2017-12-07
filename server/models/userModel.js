const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true, //Allows null
    //TODO: Validate
    maxlength: 256
  },
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
    default: false,
  },
  verificationValue: {
    type: String,
  },
  /** Stores usernames/userIDs of the user in various online judge */
  ojIds: [{
    ojname: String,
    userIds: [String], /** Some people have multiple CF accounts for example*/
  }],
}, {
  timestamps: true,
});

userSchema.plugin(mongoosePaginate);

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
