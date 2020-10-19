const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  price: {
    type: Number,
    default: 0.0,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0.0,
  },
  brand: {
      type: String,
      required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
