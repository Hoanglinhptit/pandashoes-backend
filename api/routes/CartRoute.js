module.exports = (app) => {
  const cartServices = require("../services/CartShoppingServices");
  app
    .route("/cart")
    .get(cartServices.getProductCart)
    .post(cartServices.addCart)
    .put(cartServices.updateCart)
    .delete(cartServices.deleteOneProductCart)

//   app.route("/productCart").post(cartServices.findProductCart);s
};
