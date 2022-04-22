const response = require('../common/response'),
  { model } = require('mongoose'),
  Product = model('Product'),
  utilsPagination = require('../utils/pagination'),
  imageService = require('../services/ImageSevice')

// add product
const createProduct = async (req, res) => {
  let {limit,pageIndex}= req.query
  let { name, sku, price, size, shortDescription, description, category, brand, image } = req.body
  const skuCheck = await Product.findOne({ sku })
  console.log(skuCheck);
  if (skuCheck || skuCheck !== null) {
    return res.json(response.error({ message: "product already exists" }))

  }
  const parseSize = JSON.stringify(size)
  const ProductData = { name, sku, price, size: parseSize, shortDescription, description, category, brand, image }
  const newData = new Product(ProductData)

  newData.save((err, data) => {
    if (err) return res.json(response.error({ message: err }))
    utilsPagination.pagination(data,limit,null,Product,res)
    // res.json(response.success(data))
  })


}
const updateProduct = (req, res) => {
  const id = req.query
  const { name, sku, price, size, shortDescription, description, category, brand, image } = req.body
  Product.findOneAndUpdate({ _id: id }, { name, sku, price, size, shortDescription, description, category, brand, image }, (error, data) => {
    if (error) return res.json(response.error(error))
    res.json(response.success(data))
  })
}

const getProductByBrand = async (req, res) => {
  let { brand, pageIndex, limit } = req.query
  let dataResponse = []
  const products = await Product.find({ brand }, { __v: 0 }).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
  if (products == null || !products || products.length === 0) {
    return res.json(response.error({ message: " not found products" }))
  }
  for (let i = 0; i < products.length; i++) {
    if (products[i].image.length > 0) {
      let data = products[i]
      let image = await imageService.get_img(products[i].image)
      data = {
        id: products[i]._id,
        name: products[i].name,
        sku: products[i].sku,
        price: products[i].price,
        isHot: products[i].isHot,
        size: JSON.parse(products[i].size),
        shortDescription: products[i].shortDescription,
        description: products[i].description,
        category: products[i].category,
        image,
        brand: products[i].brand

      }
      dataResponse.push(data)
    }
  }
 utilsPagination.pagination(dataResponse, limit, pageIndex, Product,res, { brand })

}
const getAllProduct = async (req, res) => {
  let { pageIndex, limit } = req.query
  let dataResponse = []
  const products = await Product.find({}, { __v: 0 },).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
  if (!products || products === null || products.length === 0) {
    return res.json(response.error({ message: "not found products" }))
  }

  for (let i = 0; i < products.length; i++) {
    if (products[i].image.length > 0) {
      let data = products[i]
      let image = await imageService.get_img(products[i].image)
      data = {
        id: products[i]._id,
        name: products[i].name,
        sku: products[i].sku,
        price: products[i].price,
        isHot: products[i].isHot,
        size: JSON.parse(products[i].size),
        shortDescription: products[i].shortDescription,
        description: products[i].description,
        category: products[i].category,
        image,
        brand: products[i].brand

      }
      dataResponse.push(data)
    }
  }
 utilsPagination.pagination(dataResponse, limit, pageIndex, Product,res)

}
const getHome = (req, res) => {
  let {keySearch, pageIndex, limit } = req.query;
  let dataResponse = [];
  console.log("query",keySearch,pageIndex,limit);
  // sua lai categories so nhieu
  if(keySearch!==""){
    let objSearch = { $regex: keySearch, $options: 'i' };
    Product.find({name:objSearch},{__v:0}).skip(utilsPagination.getOffset(pageIndex,limit)).limit(parseInt(limit)).populate('image category').exec(
      (err,data)=>{
        if(err) res.json(response.error(err))
        utilsPagination.pagination(data,limit,pageIndex,Product,res,{name:objSearch})
      }
    )

  }else{
    Product.find({},{__v:0}).skip(utilsPagination.getOffset(pageIndex,limit)).limit(parseInt(limit)).populate('image category').exec(
      (err,data)=>{
        if(err) res.json(response.error(err))
        utilsPagination.pagination(data,limit,pageIndex,Product,res)
      }
    )
  }
 
}
const getTypeQuery = (req, res) => {
  let { type, brand } = req.query
  switch (type) {
    case "home":
      getHome(req, res)
      break;
    case "product":
      if (!brand || brand == null) {
        getAllProduct(req, res)
      } else {
        getProductByBrand(req, res)
      }
      break;
    default: getAllProduct(req, res)
      break;
  }

}
const deleteProduct = async (req, res) => {
 const { id } = req.params
const product = await Product.findByIdAndDelete(id)
if(!product&& product===null){
  let arrImage = product.image
 for(let i=0;i<arrImage;i++){
  const checkImage = await Image.findByIdAndDelete({ _id: arrImage[i] })
  console.log("checkImage",checkImage);
  if (!checkImage || checkImage == null) {
    return res.json(response.error({ message: "not found image" }))
  }
  let nameImage = checkImage.fileName
  fs.unlink(`public/image/${nameImage}`, async (err) => {
    if (err) {
      return res.json(response.error({ message: err }))
    }
    else {
      res.json(response.success({ message: "delete success" }))
    }

 })
}
 
}
}




// if(!product&& product===null){
//   return res.status(404).json({msg:'err'})
// }else{
//   await product.remove()
//   res.json({msg:"product moved", product})
// }

 
// Product.findByIdAndDelete({ _id: id }).exec(async (err, data) => {
//   if (err) return res.json(response.error(err))
//   const log = await Product.find({ category: id })
//   for (let i = 0; i < log.length; i++) {
//       let arrCategory = log[i].category
//       const check = arrCategory.indexOf(data._id)
//       if (check > -1) {
//           arrCategory.splice(check, 1)
//       }
//       await log[i].save()
//   }
//   res.json(response.success({ message: `deleted category ${data.name}` }))
// })
// const postType =  (req, res) => {
//   let { type, brand } = req.query
//   switch (type) {
//     case "home":
//       getHome(req, res)
//       break;
//     case "product":
//       if (!brand || brand == null) {
//         getAllProduct(req, res)
//       } else {
//         getProductByBrand(req, res)
//       }
//       break;
//     default: getAllProduct(req, res)
//       break;
//   }

// }

module.exports = {
  createProduct, getTypeQuery,updateProduct,deleteProduct
}


