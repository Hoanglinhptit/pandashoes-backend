const {Schema,model}= require('mongoose')
const Bill = new Schema({
    user: {
        type:Schema.Types.ObjectId
    },
    productBill:[
        {
            type:Schema.Types.ObjectId
        }
    ],
    payment:{
        type:Number,
        required:[true]
    }, 
    status:{
        type:String,
        enum:[]
    }
},{
    timestamps:true,
})
module.exports = model('Bill',Bill)