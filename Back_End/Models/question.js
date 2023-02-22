const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'medecin' },
    categorie: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const question = mongoose.model('question', questionSchema);

module.exports = question;
