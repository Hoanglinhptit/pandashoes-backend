const { Schema, model } = require('mongoose')
const moment = require('moment')
const ProductBills = new Schema({
    items: [{
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      }],
    price: {
        type: Number,
        required: [true]
    },
    shipInfo : {
        type:String,
        required: [true]

    },
    
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }

} )
ProductBills.index({ '$**': 'text' })
module.exports = model('ProductBills', ProductBills)