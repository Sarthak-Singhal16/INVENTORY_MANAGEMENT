const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userLoginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

userLoginSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userLoginSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('UserLogin', userLoginSchema);
