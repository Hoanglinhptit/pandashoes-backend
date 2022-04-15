const { query } = require('express')

const response = require('../common/response'),
    { model } = require('mongoose'),
    Category = model('Category'),
    Product = model('Product'),
    utilsPagination = require('../utils/pagination')

const getCategory = (req, res) => {
    const { pageIndex, limit, keySearch } = req.query
    console.log(req.query);

    //have keySearch

    if (keySearch !== "") {
        //search
        if (pageIndex === "undefined") {
            Category.find({ name: { $regex: keySearch, $options: 'i' } }).limit(parseInt(limit)).exec((error, data) => {
                if (error) return res.json(response.error(error))
                res.json(response.success(data))
            })
        } else if (pageIndex !== "undefined") {
            //search paginate
            Category.find({ name: { $regex: keySearch, $options: 'i' } }).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec((err, data) => {
                if (err) return res.json(response.error(err))
                let pagination = utilsPagination.pagination(data, limit, pageIndex, Category, { name: { $regex: keySearch, $option: 'i' } })
                res.json(response.success(pagination))
            })
        }
    }
    // not keySearch
    else if (keySearch === "") {
        if (pageIndex !== "undefined") {
            Category.find({}).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec((err, data) => {
                if (err) return res.json(response.error(err))
                let pagination = utilsPagination.pagination(data, limit, pageIndex, Category)
                res.json(response.success(pagination))
            })
        } else if (pageIndex === "undefined") {
            Category.find({}).limit(parseInt(limit)).exec((error, data) => {
                if (error) return res.json(response.error(error))
                res.json(response.success(data))
            })
        }
    }


}

const createCategory = async (req, res) => {
    const { pageIndex, limit } = req.query
    const { category } = req.body
    console.log(category);
    const exist = await Category.find({ name: { $regex: category, $options: 'i' } }, { __v: 0 })
    console.log(exist.length);
    if (exist.length >= 1) { return res.json(response.error({ message: "name exist" })) }
    const newCategory = new Category({ name: category })
    newCategory.save((err, data) => {
        if (err) return res.json(response.error(err))

        let dataResult = {
            data,
            pageIndex: Math.ceil((Category.countDocuments()) / parseInt(limit)),
            limit
        }
        res.json(response.success(dataResult))
    })

}
const updatecategory = (req, res) => {
    const id = req.query.id
    const { nameCategory } = req.body
    Category.findByIdAndUpdate({ _id: id }, { name: nameCategory }).exec((err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })

}
const deleteCategory = async (req, res) => {
    const id = req.query.id
    console.log(req.query);
    Category.findByIdAndDelete({ _id: id }).exec(async (err, data) => {
        if (err) return res.json(response.error(err))
        const log = await Product.find({ category: id })
        for (let i = 0; i < log.length; i++) {
            let arrCategory = log[i].category
            const check = arrCategory.indexOf(data._id)
            if (check > -1) {
                arrCategory.splice(check, 1)
            }
            await log[i].save()
        }
        res.json(response.success({ message: `deleted category ${data.name}` }))
    })

}
module.exports = {
    getCategory, createCategory, updatecategory, deleteCategory,
}
