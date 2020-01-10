const Router = require("express").Router();

const gameController = require("../controllers/c_game");
const middle_purchase = require("../middlewares/middle_purchase");
const middle_auth = require("../middlewares/middle_auth");

Router.use("/CountDown", gameController.getCountDown);
Router.use("/saveTicket", middle_auth,middle_purchase,gameController.saveTicket);

module.exports = Router;
