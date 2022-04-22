const { Schema, model } = require('mongoose')
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
        default: false
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
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    views: {
        type: Number,

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
    }
},
    {
        timestamps: true,
    })
module.exports = model('Product', Product)