const mongoose = require("mongoose");

//membuat schema
const Book = mongoose.model("Book", {
  name: String,
  noHp: String,
  email: String,
});

module.exports = Book;
