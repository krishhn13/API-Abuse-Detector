const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  ip: {
    type: String
  },

  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  resolved: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Alert", alertSchema);