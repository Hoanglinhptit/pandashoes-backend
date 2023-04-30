const { Schema, model } = require('mongoose')
const moment = require('moment')
const Image = new Schema({
    fileName: {
        type: String,
        required: [true]
    },
    isPriority: {
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
Image.index({ '$**': 'text' })
module.exports = model('Image', Image)