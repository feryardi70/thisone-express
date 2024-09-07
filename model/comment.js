const mongoose = require("mongoose");

//membuat schema
const Comment = mongoose.model("Comment", {
  pesan: String,
  nama: String,
  email: String,
  date: { type: Date, default: Date.now },
});

module.exports = Comment;
