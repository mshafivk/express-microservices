const express = require("express");
const bodyParser = require("body-parser");
const { ServerError, errorHandler } = require("../helpers/errorHandler");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:CHF7Yc1mzyI70OUr@cluster0-va7i4.mongodb.net/bookservice?retryWrites=true&w=majority",
  e => {
    console.log("Database is connected - ", e);
  }
);

require("../models/Book");
const Book = mongoose.model("Book");

app.get("/", (req, res) => {
  res.send("Helllooo book");
});

app.post("/book", (req, res) => {
  //create book and post to db
  const newBook = { ...req.body };
  console.log("New book details to be saved", newBook);
  var book = new Book(newBook);
  book
    .save()
    .then(() => {
      res.send("book saved successfully");
    })
    .catch(err => {
      res.send("error saving book", err);
    });
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get("/book/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ServerError(500, "Invalid id");
    }

    const book = await Book.findById(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).send("not found");
    }
  } catch (ex) {
    next(ex);
  }
});

app.put("/updateBookCategory", async (req, res, next) => {
  try {
    const category = req.body.category;
    const bookId = req.body.id;
    if (!bookId || !category) {
      throw new ServerError(500, "Invalid Parameters");
    } else {
      const query = { _id: bookId };
      const updateQuery = { category: category };
      const result = await Book.findOneAndUpdate(query, updateQuery, {
        new: true
      });
      console.log(result);
      res.json(result);
    }
  } catch (err) {
    console.log("exception occurred");
    throw new ServerError(500, "Error updating");
  }
});

app.delete("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Input - id to delete ", id);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ServerError(500, "Invalid id");
    }

    const book = await Book.findByIdAndRemove(id);
    console.log(book);
    if (book) {
      res.send("item deleted successfully");
    } else {
      res.status(404).send("not found!");
    }
  } catch (ex) {
    next(ex);
  }
});
/**
 * Error handling middleware
 */
app.use((err, req, res, next) => errorHandler(err, res));
app.listen(4300, () => {
  console.log("Express server is up and running");
});
