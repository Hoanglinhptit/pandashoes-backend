const { Schema, model } = require('mongoose')
const moment = require('moment')
const Bill = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // productBill: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'ProductBill'
    //     }
    // ],
    products: {
        type: String,
        required: true,
        index: true
    },
    payment: {
        type: Number,
        required: [true]
    },
    status: {
        type: String,
        enum: ["processing", "received", "shipping", 'completed'],
        default: 'processing',

    },
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }

}, {
    timestamps: true
})
Bill.index({ '$**':'text' })
module.exports = model('Bill', Bill)

