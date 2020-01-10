const jwt = require("jsonwebtoken");
const M_Admin = require("../../models/admin/M_Admin");

const adminAuthMiddleware = async (req, res, next) => {
  const Authorization =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA3OTI0ZjFjZjcyOTI1MWNiMDRiYzIiLCJpYXQiOjE1Nzc1NTQ1MTF9.iHh_9taAMucvWjFFHaGFPQ76KU2nVK8x8Ku5FjvBWkE";
  // const token = req.header("Authorization").replace("Bearer ", "");
  const token = Authorization.replace("Bearer ", "");
  // DEV^
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await M_Admin.findOne({
      _id: data._id,
      "tokens.token": token
    });
    if (!user) {
      throw new Error("Invalid Email Address");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: e.message });
  }
};

module.exports = adminAuthMiddleware;
