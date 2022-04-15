module.exports = (app) => {
    const userService = require('../services/UserService')
    const verifyAuth = require('../middleWare/verifyAuth')
    app.route('/register')
        .post(userService.Register)
    app.route('/login')
        .post(userService.login)
}