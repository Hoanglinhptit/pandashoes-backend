const response = require('../common/response')
const { model } = require('mongoose')
const ShoppingCart = model('ShoppingCart')

const addCart = (req, res) => {
    const { product } = req.body
    const newCart = new ShoppingCart({ products: product })
    newCart.save((err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })

}
const updateCart = (req, res) => {

}
const deleteProductInCart = (req, res) => {

}
const deleteAllProductCart = (req, res) => {

}
const getCart = (req, res) => {
    const cartOfUser = req.params.id
    ShoppingCart.findById({ user: cartOfUser }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))
        res.json(data)
    }).populate('user product')

}


module.exports = {
    getCart, addCart, updateCart, deleteAllProductCart, deleteProductInCart

}