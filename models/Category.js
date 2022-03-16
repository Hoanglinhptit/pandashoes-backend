const {Schema,model}= require('mongoose')
const Category = new Schema({
    name: {
        type: String,
        required: [true]
    },
    isHot: {
        type: Boolean,
        default:false
    }
},{
    timestamps:true,
})
module.exports = model('Category',Category)