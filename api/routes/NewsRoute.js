module.exports = (app) => {
    const newsServices = require('../services/NewsServices')
    app.route('/news')
        .get(newsServices.getNews)
        .post(newsServices.createNews)
        .put(newsServices.updateNews)
        .delete(newsServices.deleteNews)
    app.route('/news/:id')
        .get(newsServices.getNewsDetail)

}