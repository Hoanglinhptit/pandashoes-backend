module.exports = (app) => {
        const verifyAuth = require('../middleWare/verifyAuth')
        const productService = require('../services/ProductServices')
        app.route('/product')
                .get(productService.getTypeQuery)
                .post(productService.createProduct)
                .delete(productService.deleteProduct)
                .put(productService.updateProduct)
        app.route('/product/:id')
                .get(productService.getDetailProduct)
        app.route('/product-filter')
                .get(productService.filterOptions)


}