const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String },
  googleID: { type: String },
  ua: {type: Array, required: true}
});

module.exports = mongoose.model('User', UserSchema);
