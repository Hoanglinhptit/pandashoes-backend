module.exports = (app) => {
    const verifyAuth = require('../middleWare/verifyAuth')
    const productService = require('../services/ProductServices')
    app.route('/product')
        .get(productService.getTypeQuery)
        .post(productService.createProduct)
        //     .put(productService)
        .delete(productService.deleteProduct)
    app.route('/product/:id')
        .get(productService.getDetailProduct)

}