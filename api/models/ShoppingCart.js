const { Schema, model } = require('mongoose')
const moment = require('moment')
const ShoppingCart = new Schema({
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart:
    {
        type: String,
        required: true
    }
    ,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }

}, {
    timestamps: true,
})
ShoppingCart.index({ "$**": 'text' })
module.exports = model('ShoppingCart', ShoppingCart)