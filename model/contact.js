const mongoose = require("mongoose");

//membuat schema
const Book = mongoose.model("Book", {
  nama: String,
  noHp: String,
  email: String,
});

module.exports = Book;
