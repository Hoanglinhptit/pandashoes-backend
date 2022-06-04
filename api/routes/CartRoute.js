module.exports = (app) => {
    const cartServices = require('../services/CartShoppingServices')
    app.route('/cart')
        .get(cartServices.getCart)
        .post(cartServices.addCart)
    // .put(categoryServices.updatecategory)
    .delete(cartServices.deleteProductInCart)

}