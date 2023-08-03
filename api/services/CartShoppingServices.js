const response = require("../common/response");
const { model } = require("mongoose");
const moment = require("moment");
const ShoppingCart = model("ShoppingCart");
const utilsPagination = require("../utils/pagination");

const addCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity, type } = req.body;
    const cart = await ShoppingCart.findOne({ user: userId });
    if (cart) {
      // If the cart already exists, add the product to the items array or update its quantity
      const productIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );

      if (productIndex !== -1) {
        // If the product already exists in the cart, update its quantity
        cart.items[productIndex].quantity += quantity;
      } else {
        // If the product doesn't exist in the cart, add it to the items array
        cart.items.push({ product: productId, quantity, type });
      }
      await cart.save();
      res.json(response.success(cart));
    } else {
      // If the cart doesn't exist, create a new one with the product
      const newCart = await ShoppingCart.create({
        user: userId,
        items: [{ product: productId, quantity, type }],
      });
      res.json(response.success(newCart));
    }
  } catch (error) {
    next(error);
  }
};
const updateCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity, type } = req.body;
    const cart = await ShoppingCart.findOne({ user: userId });
    if (cart) {
      // If the cart already exists, update the product quantity or remove it if quantity is 0
      const productIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );
      if (productIndex !== -1) {
        // If the product exists in the cart, update its quantity
        if (quantity === 0) {
          // If the quantity is 0, remove the product from the items array
          cart.items.splice(productIndex, 1);
        } else {
          // Update the quantity of the product
          cart.items[productIndex].quantity = quantity;
        }
        if (type !== "") {
          cart.items[productIndex].type = type;
        }
      } else {
        // If the product doesn't exist in the cart, throw an error
        throw new Error("Product not found in cart");
      }
      await cart.save();
      res.json(response.success(cart));
    } else {
      // If the cart doesn't exist, throw an error
      throw new Error("Cart not found");
    }
  } catch (error) {
    next(error);
  }
};
const deleteOneProductCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    const cart = await ShoppingCart.findOne({ user: userId });
    if (cart) {
      // If the cart already exists, remove the product from the items array
      const productIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );
      if (productIndex !== -1) {
        cart.items.splice(productIndex, 1);
      } else {
        // If the product doesn't exist in the cart, throw an error
        throw new Error("Product not found in cart");
      }
      await cart.save();
      res.json(response.success(cart));
    } else {
      // If the cart doesn't exist, throw an error
      throw new Error("Cart not found");
    }
  } catch (error) {
    next(error);
  }
};
const getProductCart = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { keySearch, limit, pageIndex } = req.query;
    const query = { user: userId };
    if (keySearch) {
      query["items.product.name"] = { $regex: keySearch, $options: "i" };
    }
    const skip = utilsPagination.getOffset(pageIndex, limit);
    const cart = await ShoppingCart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "image",
        model: "Image",
      },
      options: {
        skip: skip,
        limit,
      },
    });
    if (cart) {
      const filteredItems = cart.items.filter((item) => {
        return item.product.name
          .toLowerCase()
          .includes(keySearch.toLowerCase());
      });
      utilsPagination.pagination(
        {
          ...cart.toObject(),
          items: filteredItems,
        },
        keySearch,
        limit,
        pageIndex,
        ShoppingCart,
        res
      );
    } else {
      // If the cart doesn't exist, return an empty cart
      res.json(
        response.success({
          items: [],
          user: userId,
          time: moment(new Date()).format("DD/MM/YYYY"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

// const deleteProductInCart = (req, res) => {
//   const { products, user } = req.body;
//   ShoppingCart.findOne({ user }, { __v: 0 }, (err, data) => {
//     if (err) return res.json(response.error(err));
//     const cart = JSON.parse(data.cart);
//     for (let i = 0; i < cart.length; i++) {
//       if (cart[i].id === products) {
//         cart.splice(i, 1);
//         for (let index = 0; index < data.products.length; index++) {
//           if (data.products[i]._id.toString() === products) {
//             data.products.splice(index, 1);
//           }
//         }
//       }
//     }
//     res.json(response.success("đã xóa"));
//   });
// };
const deleteAllProductCart = (req, res) => {
  const { user } = req.body;
  ShoppingCart.findOne({ user }).exec(async (err, data) => {
    if (err) return res.json(response.error(err));
    console.log(data.items);
    await data.items.splice(0, data.items.length - 1);

    // data.cart.replace(data.cart, "");
    res.json(response.success("da xoa tat ca"));
  });
};

// const findProductCart = (req, res) => {
//   const { cart } = req.body;
//   console.log("log", cart);
//   let cartRes = [];
//   for (let i = 0; i < cart.length; i++) {
//     Product.findById({ _id: cart[i].id }, { __v: 0 }, (err, data) => {
//       if (err) return res.json(err);

//       cartRes.push({
//         id: cart[i].id,
//         name: data.name,
//         price: data.price,
//         quantity: cart[i].quantity,
//         size: cart[i].size,
//       });
//       if (i === cart.length - 1) {
//         res.json(response.success(cartRes));
//       }
//     });
//   }
// };
// const getCart = (req, res) => {
//   const idUser = req.query.id;

//   ShoppingCart.findOne({ user: idUser }, { __v: 0 }, async (err, data) => {
//     if (err) return res.json(response.error(err));
//     let listProduct = JSON.parse(data.cart);
//     let arr = [];

//     for (let i = 0; i < listProduct.length; i++) {
//       Product.findById;
//       for (let j = 0; j < data.products.length; j++) {
//         if (listProduct[i].id === data.products[j]._id.toString()) {
//           arr.push({
//             id: data.products[i]._id,
//             name: data.products[i].name,
//             price: data.products[i].price,
//             quantity: listProduct[j].quantity,
//           });
//         }
//       }
//     }
//     res.json(response.success(arr));
//   }).populate("products  ", "_id name price image");
// };

module.exports = {
  // getCart,
  addCart,
  updateCart,
  deleteAllProductCart,
  // deleteProductInCart,
  // findProductCart,
  deleteOneProductCart,
  getProductCart,
};
