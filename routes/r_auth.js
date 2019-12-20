const express = require("express");

const Router = express.Router();

const controller_auth = require("../controllers/c_auth");

Router.use("/signin", controller_auth.signIn);
Router.use("/signup", controller_auth.signup);
Router.use("/confirmcode", controller_auth.confirmCodeCheck);

module.exports = Router;
