const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const response = require('../common/response')
const { model } = require('mongoose'),
    User = model('User')
const resJson = require("../utils/pagination");
const { ShoppingCart } = require('../models');
const TOKEN_SECRET = "09f26e402586e2faa8da4c98a35f1b20d6b033c60"
exports.TOKEN_SECRET = TOKEN_SECRET
function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
}
const login = async (req, res) => {
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
                passWord: req.body.passWord
            });
            res.json(response.success({ token, user: userChek._id, name: userChek.firstName + userChek.lastName }))

        } else {
            res.json(response.error({ message: 'sai mat khau' }))
        }
    } else {
        res.json(response.error({ message: "User does not existed!" }))
    }
}

// const data = {
//     fields: [
//         {
//             keyName: "date",
//             type: 123,
//             filterOptions: {
//                 isFilter: true,
//                 typeFilter: "date"
//             }
//         }
//     ]
// }

// const body = {
//     filterOption: {
//         "email": "123213",
//         "dsadlasdsa": "12321321"
//     }
// }

const register = async (req, res) => {
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
const addUserCms = async (req, res) => {
    const { firstName, lastName, email, passWord, address, initSecret, phone, role } = req.body
    const { keySearch, limit } = req.query
    const emailCheck = await User.findOne({ email })
    if (emailCheck || emailCheck !== null) {
        return res.json(response.error({ message: "Email da dc dang ki!" }))
    }
    const hashPassword = await bcrypt.hash(passWord, 10)
    const userData = { firstName, lastName, email, phone, passWord: hashPassword, address, initSecret, role }
    const newUser = new User(userData)
    const saveUser = await newUser.save()
    if (!saveUser) {
        return res.json(response.error({ message: "Dang ki that bat" }))
    }
    if (keySearch !== "" && firstName.includes(keySearch) || lastName.includes(keySearch) || role.includes(keySearch)) {  /// name.includes(keySearch)
        User.countDocuments({ $or: [{ firstName: { $regex: keySearch, $options: 'i' } }, { lastName: { $regex: keySearch, $options: 'i' } }, { role: { $regex: keySearch, $options: 'i' } }] }, (err1, data1) => {
            if (err1) return res.json(response.error(err1))

            let dataResult = {
                saveUser,
                pageIndex: Math.ceil(data1 / parseInt(limit)),
                limit,
                keySearch
            }
            console.log(dataResult);
            res.json(response.success(dataResult))
        })
    } else {
        User.countDocuments({}, (err1, data1) => {
            if (err1) return res.json(response.error(err1))

            let dataResult = {
                saveUser,
                pageIndex: Math.ceil(data1 / parseInt(limit)),
                limit,
            }
            console.log(dataResult);
            res.json(response.success(dataResult))
        })

    }
}
const
    getUser = (req, res) => {
        const { keySearch, pageIndex, limit } = req.query
        if (keySearch !== "") {
            User.find({ $or: [{ firstName: { $regex: keySearch, $options: 'i' } }, { lastName: { $regex: keySearch, $options: 'i' } }] }, { __v: 0 }, (err, data) => {
                if (err) res.json(response.error(err))
                resJson.pagination(data, keySearch, limit, pageIndex, User, res, { $or: [{ firstName: { $regex: keySearch, $options: 'i' } }, { lastName: { $regex: keySearch, $options: 'i' } }] })

            }).populate('historyShopping favourite cart')

        } else {
            User.find({}, { __v: 0 }, (err, data) => {
                if (err) res.json(response.error(err))
                resJson.pagination(data, keySearch, limit, pageIndex, User, res)
            }).populate('historyShopping favourite cart')
        }

    }
const getUserDetail = (req, res) => {
    const { id } = req.params
    User.findById({ _id: id }, { __v: 0 }, (err, data) => {
        if (err) return res.json(err)
        resJson.pagination(data, null, null, null, User, res)
    }).populate('historyShopping favourite cart')

}

const updateAuthUser = (req, res) => {
    const { id, pageIndex, keySearch, limit } = req.query
    const { role } = req.body
    User.findByIdAndUpdate({ _id: id }, { $set: { role } }, { new: true }, (err, data) => {
        if (err) return res.json(response.error(err))
        resJson.pagination(data, keySearch, limit, pageIndex, User, res)
    })


}
const updateInforUser = (req, res) => {
    const { id } = req.params
    const { firstName, lastName, address } = req.body
    User.findByIdAndUpdate({ _id: id }, { $set: { firstName, lastName, address } }, { new: true }, (err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })

}
const deleteUser = (req, res) => {
    const { id } = req.query

    User.findByIdAndDelete({ _id: id }, (err, data) => {
        if (err) return res.json(response.error(err))
        ShoppingCart.findOneAndDelete({ user: id }, { __v: 0 })
        res.json(response.success(data))



    })

}
module.exports = {
    getUser, getUserDetail, updateInforUser, deleteUser, register, login, updateAuthUser, addUserCms

}
