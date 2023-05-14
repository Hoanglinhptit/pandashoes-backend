const { Schema, model } = require('mongoose')
const moment = require('moment')
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
        type: String,
        required: [true]
    },
    price: {
        type: Number,
        required: [true]
    },
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }

} )
ProductBills.index({ '$**': 'text' })
module.exports = model('ProductBills', ProductBills)