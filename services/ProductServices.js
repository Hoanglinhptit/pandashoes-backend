
const { model } = require('mongoose'),
    Product = model('Product'),
    Category=model('Category'),
    Image= model('Image')
const uploadImage = require('./ImageSevice')
exports.creatCategory = async (req,res)=>{
const {name}= req.body
const newData = new Category({name})
const saveCategory = await newData.save()
res.json({saveCategory})

}
// add product
exports.createProduct = async (req,res)=>{
    const {name,sku,price,size,quantity, shortDescription,description,category,brand,image } = req.body
    
    const skuCheck = await Product.findOne({sku})
    if(skuCheck||skuCheck!==null){
        return res.json({msg:"San pham da ton tai"})
    }
    const size1 = {size,quantity}
    const parseSize = await JSON.stringify(size1)
    console.log("parseSize:...........",parseSize)
    const ProductData = {name,sku,price,size:parseSize, shortDescription,description,category,brand,image}
    const newData= new Product(ProductData)
    const saveData = await newData.save()
    res.json({msg:"them san pham thanh cong",
saveData})
}

///get vans list
exports.getVans = async (req,res)=>{
    const { limit, pageIdx,brand} = req.query
    let limit1 = (parseInt(limit)<1)?1:parseInt(limit),
        pageIdx1=(parseInt(pageIdx)<1)?1:parseInt(pageIdx),
        skip=(pageIdx1-1)*limit1;
        console.log("brand",brand)
        const getBrand = await Product.find({brand: brand  },{__v:0},{skip,limit:limit1})
       console.log("getBrand", getBrand)
        const totalRecord = await Product.countDocuments({brand: brand  })
        const totalPage = await  Math.ceil(totalRecord/limit1 )
        
        if(totalRecord<0){
            return res.json({msg: "Count Error"})
        }
        if(!getBrand||getBrand===null){
            return res.json({msg:"Get Data Error"})
        } 
        res.json({
            getBrand,
            totalPage
        })
   
}
//get Converse list
exports.getConverse = async (req,res)=>{
  const { limit, pageIdx,brand} = req.query
  let limit1 = (parseInt(limit)<1)?1:parseInt(limit),
      pageIdx1=(parseInt(pageIdx)<1)?1:parseInt(pageIdx),
      skip=(pageIdx1-1)*limit1;
      console.log("brand",brand)
      const getBrand = await Product.find({brand: brand  },{__v:0},{skip,limit:limit1})
     console.log("getBrand", getBrand)
      const totalRecord = await Product.countDocuments({brand: brand  })
      const totalPage = await  Math.ceil(totalRecord/limit1 )
      
      if(totalRecord<0){
          return res.status(400).json({msg: "Count Error"})
      }
      if(!getBrand||getBrand===null){
          return res.status(500).json({msg:"Get Data Error"})
      } 
      res.json({
          getBrand,
          totalPage
      })
 
}
//getAll
exports.getAllProduct= async (req,res)=>{
    const { limit, pageIdx } = req.query
    let limit2 = (parseInt(limit)<1)?1:parseInt(limit),
        pageIdx2=(parseInt(pageIdx)<1)?1:parseInt(pageIdx),
        skip1=(pageIdx2-1)*limit2
        const getData = await Product.find({},{__v:0},{skip1,limit:limit2})
        const totalRecord1 = await Product.countDocuments()
        const totalPage1 = await  Math.ceil(totalRecord1/limit2 )
        // console.log("",limit1)
        // console.log("totalPage",totalPage)
        // console.log("totalRecord",totalRecord)
        if(totalRecord1<0){
            return res.status(400).json({msg: "Count Error"})
        }
        if(!getData||getData===null){
            return res.status(500).json({msg:"Get Data Error"})
        }
        res.json({
            getData,
            totalPage1
        })
}
// getdetail
exports.getProductbyId = async (req,res)=>{
    const product = await Product.findById(req.params.id).populate('image')

    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
}
exports.getPriority = async (req,res)=>{
    const {name,sku,price,size,quantity, shortDescription,description,category,brand } = req.body
}
 exports.deleteProductbyId = async (req, res) => {
    const product = await Product.findById(req.params.id)
  
    if (product) {
      await product.remove()
      res.status(200).json({ message: 'Product removed' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  }
exports.updateProductbyId = async (req, res) => {
    const {name,price,size,quantity, shortDescription,description,category} = req.body
    const product = await Product.findById(req.params.id)
    const size1 = {size,quantity}
    const parseSize = await JSON.stringify(size1)
    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.category = category
      product.shortDescription= shortDescription
      product.size= parseSize
  
      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  }
  exports.uploadFileImage = async (req,res)=>{

  }
  //home api 
  exports.getHomeProduct = async (req,res)=>{
    // const {isHot,brand}= req.body
    const items = [1, 2, 3,4,5,6,7,8,9,10]
const [item] = await items.sort(() => 0.5 - Math.random(3))
console.log(item)
    const getHot = await Product.find({isHot: true}).skip(1).limit(10)
    const getVans= await Product.find({isHot: true,brand:"vans"}).skip(0).limit(10)
    const getConverse = await Product.find({isHot: true,brand:"Converse"}).skip(1).limit(10)
    if(!getHot||getHot===null){
      return res.status(500).json({msg:"Get Data Error"})
    }
    if(!getVans||getVans===null){
      return res.status(500).json({msg:"Get Data Error"})
    }
    if(!getConverse||getConverse===null){
      return res.status(500).json({msg:"Get Data Error"})
    }
    return res.status(200).json({
   data:{
     "listVans":getVans,
     "listConverse":getConverse,
     "ListHome":getHot
   },
   msg:"Product not Found"
    })
  }
  