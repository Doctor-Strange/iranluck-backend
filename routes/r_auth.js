const express = require("express");

const Router = express.Router();

const controller_auth = require("../controllers/c_auth");
const middleWare_auth = require("../middlewares/middle_auth");

Router.use("/signup", controller_auth.signup);
Router.use("/signin", middleWare_auth, controller_auth.signIn);
// Router.use("/confirmcode", controller_auth.confirmCodeCheck);

module.exports = Router;
