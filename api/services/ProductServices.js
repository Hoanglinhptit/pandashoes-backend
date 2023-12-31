const response = require("../common/response"),
  { model, Types } = require("mongoose"),
  Product = model("Product"),
  Image = model("Image"),
  Category = model("Category"),
  utilsPagination = require("../utils/pagination"),
  imageService = require("../services/ImageSevice");
const filterFunction = require("../common/filterOptions");
// add product
const createProduct = async (req, res) => {
  const { limit, keySearch, pageIndex } = req.query;
  let {
    name,
    sku,
    price,
    size,
    shortDescription,
    description,
    category,
    parentCategory,
    brand,
    image,
  } = req.body;
  const skuCheck = await Product.findOne({ sku });
  console.log(skuCheck);
  if (skuCheck || skuCheck !== null) {
    return res.json(response.error({ message: "product already exists" }));
  }
  const parseSize = JSON.stringify(size);
  const ProductData = {
    name,
    sku,
    price,
    size: parseSize,
    shortDescription,
    description,
    category,
    brand,
    image,
    parentCategory,
  };
  const newData = new Product(ProductData);
  newData.save((err, data) => {
    if (err) return res.json(response.error({ message: err }));
    if (keySearch !== "") {
      utilsPagination.pagination(data, keySearch, limit, null, Product, res, {
        $or: [{ name: { $regex: keySearch, $options: "i" } }],
      });
    } else if (!keySearch || keySearch === "") {
      utilsPagination.pagination(data, keySearch, limit, null, Product, res);
    }
  });
};
const updateProduct = (req, res) => {
  const { id } = req.query;
  const {
    name,
    sku,
    price,
    size,
    shortDescription,
    description,
    category,
    brand,
    image,
    isHot,
  } = req.body;
  let dataNew = {
    name,
    sku,
    price,
    size: JSON.stringify(size),
    shortDescription,
    description,
    category: category.map((item) => {
      return item.id;
    }),
    brand,
    image: image.map((item) => {
      return item._id;
    }),
    isHot,
  };
  Product.findByIdAndUpdate(
    { _id: id },
    {
      $set: dataNew,
    },
    { new: true }
  ).exec((err, data) => {
    if (err) return res.json(response.error(err));
    console.log("dataFinal", data);
    utilsPagination.pagination(data, null, null, null, Product, res);
  });
};

const getProductByBrand = async (req, res) => {
  let { brand, pageIndex, limit } = req.query;

  const products = await Product.find({ brand }, { __v: 0 })
    .skip(utilsPagination.getOffset(pageIndex, limit))
    .limit(parseInt(limit))
    .populate([
      { path: "image", select: " _id isPriority fileName", model: Image },
      { path: "category", select: "_id name isHot", model: Category },
    ]);
  if (products == null || !products || products.length === 0) {
    return res.json(response.error({ message: " not found products" }));
  }

  utilsPagination.pagination(data, null, limit, pageIndex, Product, res, {
    brand,
  });
};
//get all and get search for admin
const getAllProduct = async (req, res) => {
  let { pageIndex, limit, keySearch, parentCategory, brand, category } =
    req.query;
  console.log("category ??", category);
  const filter = {};
  // if (keySearch) {
  //   filter.name = { $regex: keySearch, $options: "i" };
  // }
  if (parentCategory) {
    filter.parentCategory = parentCategory;
  }
  if (brand) {
    filter.brand = brand;
  }
  if (keySearch) {
    filter.name = { $regex: keySearch, $options: "i" };
  }
  // if (category) {
  //   filter['category'] = brand;
  // }
  if (category) {
    const products = await Product.find(filter, { __v: 0 })
      .where("category")
      .in(category)
      .skip(utilsPagination.getOffset(pageIndex, limit))
      .limit(parseInt(limit))
      .populate([
        { path: "image", select: " _id isPriority url fileName", model: Image },
        { path: "category", select: "_id name isHot", model: Category },
      ]);
    if (!products || products === null || products.length === 0) {
      return res.json(response.error({ message: "not found products" }));
    }
    utilsPagination.pagination(
      products,
      keySearch,
      limit,
      pageIndex,
      Product,
      res,
      { $or: [{ name: { $regex: keySearch, $options: "i" } }] }
    );
  } else {
    const products = await Product.find(filter, { __v: 0 })
      .skip(utilsPagination.getOffset(pageIndex, limit))
      .limit(parseInt(limit))
      .populate([
        { path: "image", select: " _id isPriority url fileName", model: Image },
        { path: "category", select: "_id name isHot", model: Category },
      ]);
    if (!products || products === null || products.length === 0) {
      return res.json(
        response.error({ message: "not found products thoa man" })
      );
    }
    utilsPagination.pagination(
      products,
      keySearch,
      limit,
      pageIndex,
      Product,
      res,
      {
        $or: [{ name: { $regex: keySearch, $options: "i" } }],
      }
    );
  }
};
const getHome = async (req, res) => {
  let { pageIndex, limit } = req.query;
  await Product.find({})
    .populate("category", "_id name")
    .skip(utilsPagination.getOffset(pageIndex, limit))
    .limit(parseInt(limit))
    .populate([
      { path: "image", select: " _id isPriority fileName", model: Image },
      { path: "category", select: "_id name isHot", model: Category },
    ])

    .exec(async (err, data) => {
      if (err) return res.json(response.error(err));
      // console.log(data);

      utilsPagination.pagination(data, null, limit, pageIndex, Product, res);
    });
};

const getDetailProduct = async (req, res) => {
  const { id } = req.params;
  const objectID = Types.ObjectId(id);

  try {
    // Use await to get the result directly
    const data = await Product.findOne({ _id: objectID }, { __v: 0 }).populate([
      { path: "image", select: "_id isPriority url fileName", model: Image },
      { path: "category", select: "_id name isHot", model: Category },
    ]);
    // If data is null, the document with the provided id was not found
    if (!data) {
      return res.json(response.error("Product not found"));
    }

    // Update the views count
    const updatedProduct = await Product.updateOne(
      { _id: objectID },
      { $inc: { views: 1 } }
    );

    console.log(updatedProduct);

    // Do something with the data and send the response
    utilsPagination.pagination(data, null, null, null, Product, res);
  } catch (error) {
    return res.json(response.error(error));
  }
};
const getRelateProduct = (req, res) => {
  const { id, pageIndex, limit } = req.query;
  Product.findById({ _id: id }, { __v: 0 }, (err, data) => {
    if (err) return res.json(response.error(err));
    if (pageIndex) {
      Product.find({
        $or: [
          { category: data.category },
          { price: { $regex: data.price } },
          { brand: data.brand },
        ],
      })
        .limit(parseInt(limit))
        .exec((err, data1) => {
          if (err) return res.json(response.error(err));
          utilsPagination.pagination(
            data1,
            "",
            limit,
            pageIndex,
            Product,
            res,
            {
              $or: [
                { category: data.category },
                { price: { $regex: data.price } },
                { brand: data.brand },
              ],
            }
          );
        });
    } else {
      Product.find({
        $or: [
          { category: data.category },
          { price: { $regex: data.price } },
          { brand: data.brand },
        ],
      }).exec((err, data1) => {
        if (err) return res.json(response.error(err));
        utilsPagination.pagination(data1, "", limit, pageIndex, Product, res, {
          $or: [
            { category: data.category },
            { price: { $regex: data.price } },
            { brand: data.brand },
          ],
        });
      });
    }
  });
};
const getTypeQuery = (req, res) => {
  let { type, brand } = req.query;
  switch (type) {
    case "home":
      getHome(req, res);
      break;
    // case "product":
    //   // if (brand === "" || brand === null) {
    //   //   getAllProduct(req, res);
    //   // } else {
    //   //   getProductByBrand(req, res);
    //   // }
    //   getAllProduct(req, res);
    //   break;
    default:
      getAllProduct(req, res);
      break;
  }
};
const deleteProduct = (req, res) => {
  const { id, limit, keySearch } = req.query;
  Product.findByIdAndDelete({ _id: id }, { __v: 0 }, (err, data) => {
    if (err) return res.json(response.error(err));
    if (keySearch !== "") {
      utilsPagination.pagination(data, keySearch, limit, null, Product, res);
    } else {
      utilsPagination.pagination(data, null, limit, null, Product, res);
    }
  });
};
const filterOptions = (req, res) => {
  const { options } = req.body;
  const { pageIndex, limit } = req.query;
  filterFunction.filterOptions(options, pageIndex, limit, Bill, res);
};
module.exports = {
  createProduct,
  getTypeQuery,
  getDetailProduct,
  deleteProduct,
  updateProduct,
  getRelateProduct,
  filterOptions,
};
