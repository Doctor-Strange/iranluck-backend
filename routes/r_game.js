const Router = require("express").Router();

const gameController = require("../controllers/c_game");

Router.use("/CountDown", gameController.getCountDown);

module.exports = Router;
