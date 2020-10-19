require("dotenv").config();
const express = require("express"),
  db = require("../models"),
  router = express.Router(),
  jwt = require("jsonwebtoken"),
  requireAuth = require("../middlewares/requireAuth");

router.get("/req.user", requireAuth, (req, res) => {
  res.status(200).json(req.user);
});

router.post("/register", async (req, res) => {
  try {
    const user = await db.models.user.create(req.body);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (e) {
    res.status(422).json(e.message);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      error: "Must provide email and password",
    });
  }
  const user = await db.models.user.findOne({ email });
  if (!user) {
    return next({
      status: 422,
      message: "Email not found",
    });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);
    res.send({ token });
  } catch (e) {
    return next({
      status: 422,
      message: "Invalid password or email",
    });
  }
});

module.exports = router;
