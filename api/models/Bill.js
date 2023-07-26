const { Schema, model } = require('mongoose')
const moment = require('moment')
const Bill = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productBill: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ProductBill'
        }
    ],
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }

}, {
    timestamps: true
})
Bill.index({ '$**':'text' })
module.exports = model('Bill', Bill)

