module.exports = (app) => {
    const historyShoppingServices = require('../services/historyShoppingServices')
    app.route('/historyShopping')
        .get(historyShoppingServices.getType)
        .post(historyShoppingServices.addBill)
    // .put(historyShoppingServices.updatehistoryShopping)
    // .delete(historyShoppingServices.deletehistoryShopping)
    app.route('/historyShopping/:id')
        .get(historyShoppingServices.getDetailHistoryUser)

}