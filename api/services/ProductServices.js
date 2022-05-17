

const response = require('../common/response'),
  { model } = require('mongoose'),
  Product = model('Product'),
  Image = model('Image'),
  Category = model('Category'),
  utilsPagination = require('../utils/pagination'),
  imageService = require('../services/ImageSevice')

// add product
const createProduct = async (req, res) => {
  const { limit, keySearch } = req.query
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
    if (err) return res.json(response.error(err))
    if (keySearch !== "" && name.includes(keySearch)) {
        Product.countDocuments({ name: { $regex: keySearch, $options: 'i' } }, (err1, data1) => {
            if (err1) return res.json(response.error(err))

            let dataResult = {
                data,
                pageIndex: Math.ceil(data1 / parseInt(limit)),
                limit,
                keySearch
            }
            console.log(dataResult);
            res.json(response.success(dataResult))
        })
    } else {
      Product.countDocuments({}, (err1, data1) => {
            if (err1) return res.json(response.error(err))

            let dataResult = {
                data,
                pageIndex: Math.ceil(data1 / parseInt(limit)),
                limit,
            }
            console.log(dataResult);
            res.json(response.success(dataResult))
        })

    }


})


}
const updateProduct = (req, res) => {
  const { id } = req.query
  const { name, sku, price, size, shortDescription, description, category, brand, image, isHot } = req.body
  let dataNew = {
    name, sku, price, size: JSON.stringify(size), shortDescription, description, category: category.map((item) => { return item.id }), brand, image: image.map(item => { return item._id }), isHot
  }
  console.log("data", dataNew);
  Product.findByIdAndUpdate({ _id: id }, {
    $set: dataNew
  }, { new: true }).exec((err, data) => {
    if (err) return res.json(response.error(err))
    console.log("dataFinal", data);
    utilsPagination.pagination(data, null, null, null, Product, res,)

  })
}

const getProductByBrand = async (req, res) => {
  let { brand, pageIndex, limit } = req.query

  const products = await Product.find({ brand }, { __v: 0 }).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
    .populate([{ path: 'image', select: ' _id isPriority fileName', model: Image }, { path: 'category', select: '_id name isHot', model: Category }])
  if (products == null || !products || products.length === 0) {
    return res.json(response.error({ message: " not found products" }))
  }

  utilsPagination.pagination(data, null, limit, pageIndex, Product, res, { brand })


}
//get all and get search for admin
const getAllProduct = async (req, res) => {
  let { pageIndex, limit, keySearch } = req.query
  console.log(pageIndex, limit, keySearch);



  if (keySearch !== "") {
    const products = await Product.find({ $or: [{ name: { $regex: keySearch, $options: 'i' } }] }, { __v: 0 }).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
      .populate([{ path: 'image', select: ' _id isPriority fileName', model: Image }, { path: 'category', select: '_id name isHot', model: Category }])
    if (!products || products === null || products.length === 0) {
      return res.json(response.error({ message: "not found products" }))
    }
    utilsPagination.pagination(products, keySearch, limit, pageIndex, Product, res, { $or: [{ name: { $regex: keySearch, $options: 'i' } }] })

  } else {
    const products = await Product.find({}, { __v: 0 },).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
      .populate([{ path: 'image', select: ' _id isPriority fileName', model: Image }, { path: 'category', select: '_id name isHot', model: Category }])
    if (!products || products === null || products.length === 0) {
      return res.json(response.error({ message: "not found products thoa man" }))
    }
    utilsPagination.pagination(products, "", limit, pageIndex, Product, res)
  }


}
const getHome = (req, res) => {
  let { pageIndex, limit } = req.query

  Product.find({}).populate('category', '_id name').skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
    .populate([{ path: 'image', select: ' _id isPriority fileName', model: Image }, { path: 'category', select: '_id name isHot', model: Category }])

    .exec(async (err, data) => {
      if (err) return res.json(response.error(err))
      console.log(data);

      utilsPagination.pagination(data, null, limit, pageIndex, Product, res)
    })
}

const getDetailProduct = async (req, res) => {
  const { id } = req.params
  Product.findById({ _id: id }, { __v: 0 }, async (error, data) => {
    if (error) return res.json(response.error(error))
    utilsPagination.pagination(data, null, null, null, Product, res)
  }).populate([{ path: 'image', select: ' _id isPriority fileName', model: Image }, { path: 'category', select: '_id name isHot', model: Category }]) //2 cachs 1 laf dung " image category" 2 la dung mang [{path:'image',select:'select 1',model:'Image'},{path:'category',select:'select 1',model:'category'}]

}
const getTypeQuery = (req, res) => {
  let { type, brand } = req.query
  switch (type) {
    case "home":
      getHome(req, res)
      break;
    case "product":
      if (brand === "" || brand === null) {
        getAllProduct(req, res)
      } else {
        getProductByBrand(req, res)
      }
      break;
    default: getAllProduct(req, res)
      break;
  }

}
const deleteProduct = (req, res) => {
  const { id, limit, keySearch } = req.query
  Product.findByIdAndDelete({ _id: id }, { __v: 0 }, (err, data) => {
    if (err) return res.json(response.error(err))
    if (keySearch !== "") {
      utilsPagination.pagination(data, keySearch, limit, null, Product, res)
    } else {
      utilsPagination.pagination(data, null, limit, null, Product, res)
    }
  })
}
module.exports = {
// <<<<<<< HEAD
  createProduct, getTypeQuery, getDetailProduct, deleteProduct, updateProduct,
// =======
  // createProduct, getTypeQuery, getDetailProduct, deleteProduct,updateProduct
// >>>>>>> 40e5921926f3f0a632a4d5196b7826939996d411
}


