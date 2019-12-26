const jwt = require("jsonwebtoken");
const M_user = require("../models/auth/User");

const authMiddleware = async (req, res, next) => {
  const Authorization =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA0NWRlNDFkYjhhYTBmNmM3MDA2YWEiLCJpYXQiOjE1NzczNDQ0ODR9.EIqfMEOfn4EQFMwgKdON0KVwdmZhGxA9G1DLUjwkT44";
  // const token = req.header("Authorization").replace("Bearer ", "");
  const token = Authorization.replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await M_user.findOne({
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
    res.status(401).send({ success: false, message: e.message });
  }
};

module.exports = authMiddleware;
