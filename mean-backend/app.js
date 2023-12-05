const express = require("express");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts");
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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
