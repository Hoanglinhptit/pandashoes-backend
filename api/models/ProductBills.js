const { Schema, model } = require('mongoose')
const ProductBills = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: [true]
    },
    size: {
        type: Number,
        required: [true]
    },
    price: {
        type: Number,
        required: [true]
    }

}, {
    timestamps: true,
})
module.exports = model('ProductBills', ProductBills)