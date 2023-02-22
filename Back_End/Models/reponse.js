const mongoose = require('mongoose');

const reponseSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    reponseText: { type: String, required: true },
  },
  { timestamps: true }
);

const reponse = mongoose.model('reponse', reponseSchema);

module.exports = reponse;
