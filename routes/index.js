module.exports = (app)=>{
    const ProductRoute = require('./ProductRoute');
    const UserRoute = require('./UserRoute');
    const ImageRoute = require('./ImageRoute')
    ProductRoute(app)
    UserRoute(app)
    ImageRoute(app)
}