const mongoose = require('mongoose');

const DisabledDateSchema = new mongoose.Schema({
  dates: {
    type: [Date],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DisabledDate = mongoose.model('DisabledDate', DisabledDateSchema);

module.exports = DisabledDate;
