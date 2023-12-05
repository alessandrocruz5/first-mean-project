const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://acruz:tdoUm1ijs9XvBbfT@cluster0.a7izvec.mongodb.net/mean-db?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(() => {
    console.log("Connection failed.");
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully!",
      postId: createdPost._id,
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  // const posts = [
  //   {
  //     id: "afdsa32fs",
  //     title: "Post 1",
  //     content: "Content of post 1",
  //   },
  //   {
  //     id: "2edaf32gs",
  //     title: "Post 2",
  //     content: "Content of post 2",
  //   },
  // ];

  Post.find().then((docs) => {
    console.log(docs);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: docs,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted." });
  });
});

module.exports = app;
