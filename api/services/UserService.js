const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const response = require('../common/response')
const { model } = require('mongoose'),
    User = model('User')

const TOKEN_SECRET = "09f26e402586e2faa8da4c98a35f1b20d6b033c60"
exports.TOKEN_SECRET = TOKEN_SECRET
function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
}
exports.login = async (req, res) => {
    const { email, passWord } = req.body
    const userChek = await User.findOne({ email })
    // const passWordCheck = await User.findOne({passWord})
    console.log("userChek", userChek)

    if (userChek && userChek !== null) {
        const deCode = await bcrypt.compare(passWord, userChek.passWord)
        console.log("", deCode)
        if (deCode === true) {

            const token = generateAccessToken({
                email: req.body.email,
               
            });
            res.json(response.success({ token }))

        } else {
            res.json(response.error({ message: 'sai mat khau' }))
        }
    } else {
        res.json(response.error({ message: "User does not existed!" }))
    }
}


exports.Register = async (req, res) => {
    const { firstName, lastName, email, passWord, address, initSecret, phone } = req.body
    const emailCheck = await User.findOne({ email })
    if (emailCheck || emailCheck !== null) {
        return res.json(response.error({ message: "Email da dc dang ki!" }))
    }
    const hashPassword = await bcrypt.hash(passWord, 10)
    const userData = { firstName, lastName, email, phone, passWord: hashPassword, address, initSecret }
    const newUser = new User(userData)
    const saveUser = await newUser.save()
    if (!saveUser) {
        return res.json(response.error({ message: "Dang ki that bat" }))
    }
    res.json(response.success(
        saveUser
    ))
}
