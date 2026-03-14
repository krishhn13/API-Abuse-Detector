const mongoose = require("mongoose");

const ipSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ["allowed", "blocked", "suspicious"],
    default: "allowed"
  },

  reason: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("IP", ipSchema);