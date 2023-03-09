const mongoose = require('mongoose');

// define the base user schema
const userverificationSchema = new mongoose.Schema(
  {
    UserId: { type: String},
    uniqueString: { type: String},
    createdAt: { type: Date },
    expiredAt:{type: Date}
  })


const userverification = mongoose.model('userverification', userverificationSchema);
module.exports = userverification