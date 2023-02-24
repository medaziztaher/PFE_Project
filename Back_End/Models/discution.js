const mongoose = require('mongoose');
const { Schema } = mongoose;

const discussionSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, { timestamps: true });

const discussion = mongoose.model('discussion', discussionSchema);

module.exports = discussion;
