module.exports = (app) => {
    const historyShoppingServices = require('../services/historyShoppingServices')
    app.route('/historyShopping')
        .get(historyShoppingServices.getType)
        .post(historyShoppingServices.addBill)
        .put(historyShoppingServices.updateStateBill)
        .delete(historyShoppingServices.deleteBill)
    app.route('/historyShopping/:id')
        .get(historyShoppingServices.getDetailHistoryUser)

    app.route('/historyShoppingFilter')
        .post(historyShoppingServices.filterOptions)


}