const Router = require("express").Router();

const gameController = require("../controllers/c_game");

Router.use("/CountDown", gameController.getCountDown);
Router.use("/saveTicket", gameController.saveTicket);

module.exports = Router;
