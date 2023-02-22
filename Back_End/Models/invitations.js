const mongoose = require('mongoose');

const InvitationsSchema = new mongoose.Schema({
  _emetteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  _recepteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['Accepter', 'Refuser','Pending'],
    default: 'Pending'
  }
});

const invitations = mongoose.model('invitations', InvitationsSchema);

module.exports = invitations;
