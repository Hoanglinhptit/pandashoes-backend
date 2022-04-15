const {Schema,model}= require('mongoose')
const Image = new Schema({
    fileName:{
        type: String,
        required: [true]
    },
    isPriority:{
        type: Boolean,
        default:false
    }
},{
    timestamps:true,
})
module.exports= model('Image',Image)