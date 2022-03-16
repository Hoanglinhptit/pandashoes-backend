module.exports = (app) => {
    const UserService = require('../services/UserService')
    const verifyAuth = require('../middleWare/verifyAuth')
    app.route('/Register')
    .post(UserService.Register)
    app.route('/Login')
    .post(UserService.login)
}