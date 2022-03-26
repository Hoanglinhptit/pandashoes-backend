module.exports = (app) => {
    const verifyAuth = require('../middleWare/verifyAuth')
    const ProductService = require('../services/ProductServices')
    app.route('/Create-Category')
    .post(verifyAuth.authenticateToken,verifyAuth.authenAdmin,ProductService.creatCategory)
    app.route('/Create-product')
    .post(ProductService.createProduct)  
    app.route('/getAll')
    .get(ProductService.getAllProduct) 
    app.route("/Vans")
    .get(ProductService.getVans)
    app.route('/Converse')
    .get(ProductService.getConverse)
    app.route("/Home")
    // .get(ProductService.getPriority)
    .get(ProductService.getHomeProduct) 
    app.route("/Product/:id")
    .get(ProductService.getProductbyId)
    .delete(verifyAuth.authenticateToken,verifyAuth.authenAdmin,ProductService.deleteProductbyId)
    .put(verifyAuth.authenticateToken,verifyAuth.authenAdmin,ProductService.updateProductbyId)
    
   
}