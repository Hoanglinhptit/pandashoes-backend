module.exports = (app) => {
    const cartServices = require('../services/CartShoppingServices')
    app.route('/cart')
        .get(cartServices.getCart)
        .post(cartServices.addCart)
    // .put(categoryServices.updatecategory)
    // .delete(categoryServices.deleteCategory)
    app.route('/productCart')
        .post(cartServices.findProductCart)

}