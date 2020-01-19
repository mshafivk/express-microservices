const mongoose = require("mongoose");

//title,author,publisher,numberOfPages,category
mongoose.model("Book", {
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: false
  },
  numberOfPages: {
    type: String
  },
  category: {
    type: String
  }
});
