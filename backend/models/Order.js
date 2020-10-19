const mongoose = require("mongoose"),
  schema = mongoose.Schema.Types.ObjectId;

const OrderSchema = new mongoose.Schema(
  {
    expected_delivery: {
      type: String,
      required: true,
    },
    customer: {
      type: schema,
      ref: "User",
    },
    products: [
      {
        type: schema,
        ref: "Product",
      },
    ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
