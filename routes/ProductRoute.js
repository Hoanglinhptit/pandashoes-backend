module.exports = (app) => {
    const verifyAuth = require('../middleWare/verifyAuth')
    const ProductService = require('../services/ProductServices')
    app.route('/Create-Category')
    .post(verifyAuth.authenticateToken,verifyAuth.authenAdmin,ProductService.creatCategory)
    app.route('/Create-product')
    .post(ProductService.createProduct)  
    app.route('/getAll')
    .get(ProductService.getAllProduct)  
}