require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const models = {
  user: require("./User"),
  products: require("./Product"),
  orders: require("./Order")
};

module.exports.models = models;
