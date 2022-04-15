const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { TOKEN_SECRET } = require("../services/UserService")
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        console.log("err", err)
        if (err) return res.sendStatus(403)
        console.log("user:", user)
        req.user = user
        next()
    })
}
exports.authenAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email })
        if (user.role !== "admin") {
            return res.sendStatus(400).json({ msg: "Khong the truy cap" })
        }

        next()

    } catch (error) {
        return res.json({ msg: "lỗi server" })
    }

}