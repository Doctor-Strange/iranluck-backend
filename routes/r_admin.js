const express = require("express");

const Router = express.Router();

const controller_admin = require("../controllers/admin/c_admin");
const controller_draw = require("../controllers/admin/c_draw");
const middle_auth_admin = require("../middlewares/admin_middlewares/middle_auth_admin");
const middle_admin_confirm_Gen = require("../middlewares/admin_middlewares/middle_admin_confirm_Gen");

Router.use("/signup", controller_admin.signup);
Router.use(
  "/signin",
  middle_auth_admin,
  middle_admin_confirm_Gen,
  controller_admin.signIn
);
Router.use(
  "/manualDraw",
  //  middle_auth_admin,
  controller_draw.manualDraw
);
Router.use(
  "/getThisDrawTickets",
  // middle_auth_admin,
  controller_draw.getThisDrawTickets
);
Router.use(
  "/lastJackpot",
  //  middle_auth_admin,
  controller_draw.lastJackpot
);
Router.use(
  "/getRegisteredUser",
  //   middle_auth_admin,
  controller_draw.getRegisteredUser
);
Router.use("/confirmcode", controller_admin.confirmCodeCheck);
Router.use(
  "/getWinnerTicketsByDraw",
  //   middle_auth_admin,
  controller_draw.getWinnerTicketsByDraw
);
Router.use(
  "/getAllWinnerTickets",
  //   middle_auth_admin,
  controller_draw.getAllWinnerTickets
);

module.exports = Router;
