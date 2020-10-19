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
      console.log(err);
      return res.status(401).send({
        error: "You must be logged in!",
      });
    }
    const { userId, iat } = payload;
    const user = await db.models.user.findById(userId);
    req.user = {
      isAdmin: user.isAdmin,
      id: user._id,
      expiresIn: `${(60 - new Date().getMinutes() + iat / 60000000).toFixed(1)} minutes`
    };
    next();
  });
};
