const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  items: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: Number,
    },
  ],
  user: {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
