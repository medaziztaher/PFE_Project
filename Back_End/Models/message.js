const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  _recepteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required: true,
  },
  _emeteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required: true,
  },
  message_texte: {
    type: String,
    required: true,
  },
  discution: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'discution'
  }
}, { timestamps: true });

const message = mongoose.model('message', MessageSchema);

module.exports = message;
