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

                utilsPagination.pagination(data, keySearch, limit, null, Category, res, { name: { $regex: keySearch, $options: 'i' } })
            })

        } else if (pageIndex !== "undefined") {
            //search paginate

            Category.find({ name: { $regex: keySearch, $options: 'i' } }).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec((err, data) => {
                if (err) return res.json(response.error(err))
                console.log("hoolo", data);
                utilsPagination.pagination(data, keySearch, limit, pageIndex, Category, res, { name: { $regex: keySearch, $options: 'i' } })

            })
        }
    }
    // not keySearch
    else if (keySearch === "") {
        console.log("req ne", req.query);
        if (pageIndex !== "undefined") {
            Category.find({}).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec((err, data) => {
                if (err) return res.json(response.error(err))
                utilsPagination.pagination(data, keySearch, limit, pageIndex, Category, res)

            })
        } else if (pageIndex === "undefined") {
            Category.find({}).limit(parseInt(limit)).exec((error, data1) => {
                if (error) return res.json(response.error(error))
                console.log("data ne", data1);
                utilsPagination.pagination(data1, keySearch, limit, null, Category, res)

            })
        }
    }


}

const createCategory = async (req, res) => {
    const { limit, keySearch } = req.query
    const { name } = req.body
    console.log("name", name);


    // console.log(category);
    const exist = await Category.find({ name: { $regex: name, $options: 'i' } }, { __v: 0 })
    // console.log(exist.length);
    if (exist.length >= 1) { return res.json(response.error({ message: "name exist" })) }
    const newCategory = new Category({ name: name })
    newCategory.save((err, data) => {
        if (err) return res.json(response.error(err))
        if (keySearch !== "" && name.includes(keySearch)) {
            Category.countDocuments({ name: { $regex: keySearch, $options: 'i' } }, (err1, data1) => {
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
            Category.countDocuments({}, (err1, data1) => {
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
const updatecategory = (req, res) => {
    const id = req.query.id
    const { name, isHot } = req.body
    Category.findByIdAndUpdate({ _id: id }, { $set: { name, isHot } }, { new: true }).exec((err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })

}
const deleteCategory = async (req, res) => {
    const { id } = req.query
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
const getCategoryDetail = (req, res) => {
    const { id } = req.params
    Category.findById({ _id: id }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })
}
module.exports = {
    getCategory, createCategory, updatecategory, deleteCategory, getCategoryDetail
}
