const {Schema,model}= require('mongoose')
const ShoppingCart = new Schema({
    product:[
        {
            type: Schema.Types.ObjectId,
            ref:'Product'
        }
    ],

},{
    timestamps:true,
})
module.exports= model('ShoppingCart', ShoppingCart)