const response = require('../common/response'),
  { model } = require('mongoose'),
  Product = model('Product'),
  utilsPagination = require('../utils/pagination'),
  imageService = require('../services/ImageSevice')

// add product
const createProduct = async (req, res) => {
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
    res.json(response.success(data))
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
  let pagination = utilsPagination.pagination(dataResponse, limit, pageIndex, Product, { brand })
  res.json(response.success(pagination))

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
  let pagination = utilsPagination.pagination(dataResponse, limit, pageIndex, Product)
  res.json(response.success(pagination))
}
const getHome = (req, res) => {
  let { pageIndex, limit } = req.query
  let dataResponse = []
  Product.find({}).populate('category', '_id name').skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec(async (err, data) => {
    if (err) return res.json(response.error(err))
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].image.length > 0) {

        let image = await imageService.get_img(data[i].image)
        let dataResult = {
          id: data[i]._id,
          name: data[i].name,
          sku: data[i].sku,
          price: data[i].price,
          isHot: data[i].isHot,
          size: JSON.parse(data[i].size),
          shortDescription: data[i].shortDescription,
          description: data[i].description,
          category: data[i].category,
          image,
          brand: data[i].brand

        }
        dataResponse.push(dataResult)
      }
    }
    res.json(response.success(utilsPagination.pagination(dataResponse, limit, pageIndex, Product)))
  })
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

module.exports = {
  createProduct, getTypeQuery,
}


