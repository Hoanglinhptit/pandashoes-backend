module.exports = (app) => {
    const productRoute = require('./ProductRoute');
    const userRoute = require('./UserRoute');
    const imageRoute = require('./ImageRoute')
    const categoryRoute = require('./CategoryRoute')
    const newsRoute = require('./NewsRoute')
    const cartRoute = require('./CartRoute')
    const historyShopping = require('./HistoryShoppingRoute')
    const ChatRoute = require('./ChatRoute')
    productRoute(app)
    userRoute(app)
    imageRoute(app)
    categoryRoute(app)
    newsRoute(app)
    cartRoute(app)
    historyShopping(app)
    ChatRoute(app)

}