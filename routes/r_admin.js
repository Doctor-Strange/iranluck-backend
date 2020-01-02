const express = require("express");

const Router = express.Router();

const controller_admin = require("../controllers/admin/c_admin");
const controller_draw = require("../controllers/admin/c_draw");
const middleWare_auth = require("../middlewares/midde_auth");

Router.use("/signup", controller_admin.signup);
Router.use("/signin", middleWare_auth, controller_admin.signIn);
Router.use(
  "/manualDraw",
  //  middleWare_auth,
  controller_draw.manualDraw
);
Router.use(
  "/getThisDrawTickets",
  // middleWare_auth,
  controller_draw.getThisDrawTickets
);
Router.use(
  "/lastJackpot",
  //  middleWare_auth,
  controller_draw.lastJackpot
);
Router.use(
  "/getRegisteredUser",
  //   middleWare_auth,
  controller_draw.getRegisteredUser
);
Router.use("/confirmcode", controller_admin.confirmCodeCheck);
Router.use(
  "/getWinnerTicketsByDraw",
  //   middleWare_auth,
  controller_draw.getWinnerTicketsByDraw
);
Router.use(
  "/getAllWinnerTickets",
  //   middleWare_auth,
  controller_draw.getAllWinnerTickets
);

module.exports = Router;
