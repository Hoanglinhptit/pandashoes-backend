module.exports = (app)=>{
    const ProductRoute = require('./ProductRoute');
    const UserRoute = require('./UserRoute');
    ProductRoute(app)
    UserRoute(app)
}