module.exports = (app) => {
    const productRoute = require('./ProductRoute');
    const userRoute = require('./UserRoute');
    const imageRoute = require('./ImageRoute')
    const categoryRoute = require('./CategoryRoute')
    productRoute(app)
    userRoute(app)
    imageRoute(app)
    categoryRoute(app)
}