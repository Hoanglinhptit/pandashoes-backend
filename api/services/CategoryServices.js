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
                // res.json(response.success(data))
                utilsPagination.pagination(data, limit, pageIndex,Category,res, { name: { $regex: keySearch, $options: 'i' } })
                
            })
        } else if (pageIndex !== "undefined") {
            //search paginate
            console.log("pageIndex", pageIndex, " limit", limit, "keySearch", keySearch);
            Category.find({ name: { $regex: keySearch, $options: 'i' } }).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec((err, data) => {

                if (err) return res.json(response.error(err))
                utilsPagination.pagination(data, limit, pageIndex, Category, res, { name: { $regex: keySearch, $options: 'i' } })

            })
        }
    }
    // not keySearch
    else if (keySearch === "") {
        if (pageIndex !== "undefined") {
            Category.find({}).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).exec((err, data) => {
                if (err) return res.json(response.error(err))
                utilsPagination.pagination(data, limit, pageIndex, Category, res)

            })
        } else if (pageIndex === "undefined") {
            Category.find({}).limit(parseInt(limit)).exec((error, data) => {
                if (error) return res.json(response.error(error))
                utilsPagination.pagination(data,limit,pageIndex,Category,res)
            })
        }
    }


}

const createCategory = async (req, res) => {
    const { limit, keySearch } = req.query
    const { name } = req.body
    // console.log(category);
    const exist = await Category.find({ name: { $regex: name, $options: 'i' } }, { __v: 0 })
    // console.log(exist.length);
    if (exist.length >= 1) { return res.json(response.error({ message: "name exist" })) }
    const newCategory = new Category({ name: name })
    newCategory.save((err, data) => {
        if (err) return res.json(response.error(err))
        if(keySearch===""){
                utilsPagination.pagination(data,limit,null,Category,res)
            }else  if(keySearch!==""){
                utilsPagination.pagination(data,limit,null,Category,res,{ name: { $regex: keySearch, $options: 'i' } })
            }
        }
        
)

}
const updatecategory = (req, res) => {
    const id = req.query.id
    const { name } = req.body
    Category.findByIdAndUpdate({ _id: id }, { name: name }).exec((err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })

}
const deleteCategory = async (req, res) => {
    // const {pageIdx,limit}= req.query
    const id = req.query.id
    console.log(req.query);
    Category.findByIdAndDelete({ _id: id }).exec(async (err, data) => {
        if (err) return res.json(response.error(err))
        const log = await Product.find({ category: id })
        console.log("log",log)
        for (let i = 0; i < log.length; i++) {
            let arrCategory = log[i].category
            const check = arrCategory.indexOf(data._id)
            if (check > -1) {
                arrCategory.splice(check, 1)
            }
            await log[i].save()
        }
        res.json(response.success({ message: `deleted category ${data.name}` }))
        console.log(`deleted category ${data.name}`)
    })

}
/// Xoa danh muc va cac san pham lien quan 

module.exports = {
    getCategory, createCategory, updatecategory, deleteCategory,
}
