const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  s3KeyName: { type: String, required: true },
  s3BucketName: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, of: String, required: true },
  usersDisliked: { type: Array, of: String, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);


