const { Schema, model } = require('mongoose')
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
    }

}, {
    timestamps: true,
})
module.exports = model('ShoppingCart', ShoppingCart)