module.exports = (app) => {
    const verifyAuth = require('../middleWare/verifyAuth')
    const productService = require('../services/ProductServices')
    app.route('/product')
        .get(productService.getTypeQuery)
        .post(productService.createProduct)
        
    app.route('/product/:id')
    .put(productService.updateProduct)
    .delete(productService.deleteProduct)
    //     .put(productService)
    //     .delete(productService)

}