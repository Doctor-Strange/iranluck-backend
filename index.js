require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const router_auth = require("./routes/r_auth");
const router_game = require("./routes/r_game");

const draw = require("./utils/draw");

let PORT = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ["*"]);
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// Utils functions
// Start the timer and execute a weekly draw
draw.draw();

// Routes
app.use("/auth", router_auth);
app.use("/game", router_game);

// Data base connection
mongoose
  .connect("mongodb://localhost:27017/mongoIranLuckDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    app.listen(PORT, () => {
      console.log(
        `
   ----------------------------------------------------
  |                                                     |
  |                    Iran Luck                        |
  |   You are successfuly connected to the database.    |
  |              The server is running on               |
  |                http://localhost:${PORT}                |
  |                                                     |
   ----------------------------------------------------
   Ver: 0.1.0`
      );
    });
  })
  .catch(err => {
    console.log(err);
  });
