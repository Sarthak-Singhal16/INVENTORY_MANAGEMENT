const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('UserLogin', userLoginSchema);
