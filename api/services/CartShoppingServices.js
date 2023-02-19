const response = require("../common/response");
const { model } = require("mongoose");
const CartRoute = require("../routes/CartRoute");
const ShoppingCart = model("ShoppingCart");
const Image = model("Image");
const Product = model("Product");
const addCart = (req, res) => {
  const { products, user } = req.body;
  let arrId = products.map((item) => {
    return item.id;
  });
  const dataCart = {
    products: arrId,
    cart: JSON.stringify(products),
    user,
  };
  const newCart = new ShoppingCart(dataCart);
  newCart.save((err, data) => {
    if (err) return res.json(response.error(err));
    res.json(response.success(data));
  });
};
const updateCart = (req, res) => {
  const { products, user } = req.body;
  let arrId = products.map((item) => {
    return item.id;
  });
  const dataCart = {
    products: arrId,
    cart: JSON.stringify(products),
  };
  ShoppingCart.findOneAndUpdate(
    { user },
    { $set: { dataCart } },
    { new: true },
    (err, data) => {
      if (err) return res.json(response.error(err));
      res.json(response.success(data));
    }
  );
};
const deleteProductInCart = (req, res) => {
  const { products, user } = req.body;
  ShoppingCart.findOne({ user }, { __v: 0 }, (err, data) => {
    if (err) return res.json(response.error(err));
    const cart = JSON.parse(data.cart);
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === products) {
        cart.splice(i, 1);
        for (let index = 0; index < data.products.length; index++) {
          if (data.products[i]._id.toString() === products) {
            data.products.splice(index, 1);
          }
        }
      }
    }
    res.json(response.success("đã xóa"));
  });
};
const deleteAllProductCart = (req, res) => {
  const { user } = req.body;
  ShoppingCart.findOne({ user }).exec(async (err, data) => {
    if (err) return res.json(response.error(err));
    await data.products.splice(0, data.products.length - 1);
    data.cart.replace(data.cart, "");
    res.json(response.success("da xoa tat ca"));
  });
};

const findProductCart = (req, res) => {
  const { cart } = req.body;
  console.log("log", cart);
  let cartRes = [];
  for (let i = 0; i < cart.length; i++) {
    Product.findById({ _id: cart[i].id }, { __v: 0 }, (err, data) => {
      if (err) return res.json(err);

      cartRes.push({
        id: cart[i].id,
        name: data.name,
        price: data.price,
        quantity: cart[i].quantity,
        size: cart[i].size,
      });
      if (i === cart.length - 1) {
        console.log("cart", cartRes);
        res.json(response.success(cartRes));
      }
    });
  }
};
const getCart = (req, res) => {
  const idUser = req.query.id;

  ShoppingCart.findOne({ user: idUser }, { __v: 0 }, async (err, data) => {
    if (err) return res.json(response.error(err));
    let listProduct = JSON.parse(data.cart);
    let arr = [];

    for (let i = 0; i < listProduct.length; i++) {
      Product.findById;
      for (let j = 0; j < data.products.length; j++) {
        if (listProduct[i].id === data.products[j]._id.toString()) {
          arr.push({
            id: data.products[i]._id,
            name: data.products[i].name,
            price: data.products[i].price,
            quantity: listProduct[j].quantity,
          });
        }
      }
    }
    res.json(response.success(arr));
  }).populate("products  ", "_id name price image");
};

module.exports = {
  getCart,
  addCart,
  updateCart,
  deleteAllProductCart,
  deleteProductInCart,
  findProductCart,
};
