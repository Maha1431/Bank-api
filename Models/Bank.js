// models/Bank.js
const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branch: String,
  ifsc: String,
});

const BankSchema = new mongoose.Schema({
  name: String,
  branches: [BranchSchema],
});

module.exports = mongoose.model('Bank', BankSchema);
