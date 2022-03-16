
const { model } = require('mongoose'),
    Product = model('Product'),
    Category=model('Category')
exports.creatCategory = async (req,res)=>{
const {name}= req.body
const newData = new Category({name})
const saveCategory = await newData.save()
res.json({saveCategory})

}
exports.createProduct = async (req,res)=>{
    const {name,sku,price,size,quantity, shortDescription,description,category } = req.body
    const skuCheck = await Product.findOne({sku})
    if(skuCheck||skuCheck!==null){
        return res.json({msg:"San pham da ton tai"})
    }
    const size1 = {size,quantity}
    const parseSize = await JSON.stringify(size1)
    console.log("parseSize:...........",parseSize)
    const ProductData = {name,sku,price,size:parseSize, shortDescription,description,category }
    const newData= new Product(ProductData)
    const saveData = await newData.save()
    res.json({msg:"them san pham thanh cong",
saveData})
}
exports.getAllProduct = async (req,res)=>{
    const { limit, pageIdx } = req.query
    let limit1 = (parseInt(limit)<1)?1:parseInt(limit),
        pageIdx1=(parseInt(pageIdx)<1)?1:parseInt(pageIdx),
        skip=(pageIdx1-1)*limit1
    
        const getData = await Product.find({},{__v:0},{skip,limit:limit1})
        const totalRecord = await Product.countDocuments()
        const totalPage = await  Math.ceil(totalRecord/limit1 )
        console.log("",limit1)
        console.log("totalPage",totalPage)
        console.log("totalRecord",totalRecord)
        if(totalRecord<0){
            return res.json({msg: "Count Error"})
        }
        if(!getData||getData===null){
            return res.json({msg:"Get Data Error"})
        }
        res.json({
            getData,
            totalPage
        })
}