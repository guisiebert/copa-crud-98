const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const fs = require("fs");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome friends");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
