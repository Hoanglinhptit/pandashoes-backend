const { Schema, model } = require('mongoose')
const moment = require('moment')
const Category = new Schema({
    name: {
        type: String,
        required: [true]
    },
    isHot: {
        type: Boolean,

        default: false
    },
    time: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY')
    }
}, {
    timestamps: true,
})
Category.index({ '$**': 'text' })
module.exports = model('Category', Category)