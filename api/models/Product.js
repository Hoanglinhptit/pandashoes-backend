const { Schema, model } = require('mongoose')
const moment = require('moment')
const Product = new Schema({
    name: {
        type: String,
        required: [true]
    },
    sku: {
        type: String,
        required: [true]
    },
    price: {
        type: Number,
        required: [true]
    },
    isHot: {
        type: Boolean,
        default: false,
        index: 1,
    },
    size: {
        type: Schema.Types.String,

    },
    shortDescription: {
        type: String,
        required: [true]
    },
    description: {
        type: String,
        required: [true]
    },
    parentCategory : {
        type: String,
        // required: [true]
    },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            index: 1,
        }
    ],
    views: {
        type: Number,
        default: 1

    },
    image: [
        {
            type: Schema.Types.ObjectId,
            ref: "Image"
        }
    ],
    brand: {
        type: String,
        required: [true]
    },
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }
},
    {
        timestamps: true,
    })
Product.index({ '$**': 'text' })
module.exports = model('Product', Product)