const { Schema, model } = require("mongoose");
const moment = require("moment");
const ShoppingCart = new Schema(
  {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        type: {
          type: String,
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    time: {
      type: String,
      default: moment(new Date()).format("DD/MM/YYYY"),
    },
  },
  {
    timestamps: true,
  }
);
ShoppingCart.index({ "$**": "text" });
module.exports = model("ShoppingCart", ShoppingCart);
