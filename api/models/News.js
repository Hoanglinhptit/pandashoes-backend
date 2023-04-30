const { Schema, model } = require('mongoose')
const moment = require('moment')
const News = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true
        },
        posts: {
            type: String,
            required: true
        },
        author: {
            type: String,

        },
        views: {
            type: Number,
            default: 1
        },
        time: {
            type: String,
            default: moment(new Date()).format('DD/MM/YYYY')
        }

    },
    {
        timestamps: true,
    }
)
News.index({ '$**': 'text' })
module.exports = model('News', News)
