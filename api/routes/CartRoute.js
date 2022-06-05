module.exports = (app) => {
    const cartServices = require('../services/CartShoppingServices')
    app.route('/cart')
        .get(cartServices.getCart)
        .post(cartServices.addCart)
    // .put(categoryServices.updatecategory)
<<<<<<< HEAD
    .delete(cartServices.deleteProductInCart)
=======
    // .delete(categoryServices.deleteCategory)
    app.route('/productCart')
        .post(cartServices.findProductCart)
>>>>>>> 10efee4f6d541bb40cbd1471877f60d174bb853c

}