require("dotenv").config();

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT || 5000,
  cors = require("cors"),
  authRoutes = require("./routes/auth"),
  productRoutes = require("./routes/product"),
  orderRoutes = require("./routes/order"),
  requireAuth = require("./middlewares/requireAuth"),
  errorHandler = require("./middlewares/errors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(authRoutes);
app.use(productRoutes);
app.use(orderRoutes);

app.get("/", requireAuth, (req, res) => {
  res.json({ message: `Welcome Back,${req.user.username}` });
});

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started at : http://localhost:5000/`);
});
