require("dotenv").config();
const jwt = require("jsonwebtoken"),
  db = require("../models");

module.exports = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).send({
      error: "You must be logged in!",
    });
  }

  jwt.verify(token, process.env.SECRET, async (err, payload) => {
    if (err) {
      console.log(err)
      return res.status(401).send({
        error: "You must be logged in!",
      });
    }
    const { userId } = payload;
    console.log(token,payload)
    const user = await db.models.user.findById(userId);
    req.user = user;
    next();
  });
};
