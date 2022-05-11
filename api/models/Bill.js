const { Schema, model } = require('mongoose')
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
        required: true
    },
    payment: {
        type: Number,
        required: [true]
    },
    status: {
        type: String,
        enum: ["processing", "received", "shipping", 'completed'],
        default: 'processing'
    }
}, {
    timestamps: true,
})
module.exports = model('Bill', Bill)