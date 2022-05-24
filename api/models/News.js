const { Schema, model } = require('mongoose')
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
        }

    },
    {
        timestamps: true,
    }
)
module.exports = model('News', News)
