const { Schema, model } = require("mongoose");
const User = new Schema(
  {
    firstName: {
      type: String,
      required: [true],
    },
    lastName: {
      type: String,
      required: [true],
    },
    email: {
      type: String,
      required: [true],
      index: { unique: true },
    },
    phone: {
      type: String,
      required: true,
    },
    passWord: {
      type: String,
      required: [true],
    },
    address: {
      type: String,
      required: [true],
    },
    initSecret: {
      type: String,
      required: [true],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    historyShopping: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bill",
      },
    ],
    favourite: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCart",
    },

    // historyChats: [
    //   {
    //     type: String,
    //     required: [true],
    //   },
    // ],
    // time: {
    //     type: String,
    //     default: moment(new Date()).format('DD/MM/YYYY'),
    //     es_indexed: true
    // }
  },
  {
    timestamps: true,
  }
);
User.index({ "$**": "text" });
module.exports = model("User", User);
