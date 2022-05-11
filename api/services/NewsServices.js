const response = require('../common/response')
const { model } = require('mongoose')
const utilsPagination = require('../utils/pagination')
const News = model('News')

const getNews = (req, res) => {
    const { pageIndex, limit, keySearch } = req.query
    console.log(req.query);
    if (keySearch !== "") {
        //search

        News.find({ title: { $regex: keySearch, $options: 'i' } }).limit(parseInt(limit)).populate('author', 'firstName lastName').exec((error, data) => {
            if (error) return res.json(response.error(error))

            utilsPagination.pagination(data, keySearch, limit, null, News, res, { title: { $regex: keySearch, $options: 'i' } })
        })


    }
    // not keySearch
    else if (keySearch === "") {
        console.log("req ne", req.query);
        News.find({}).skip(utilsPagination.getOffset(pageIndex, limit)).limit(parseInt(limit)).populate('author', 'firstName lastName').exec((err, data) => {
            if (err) return res.json(response.error(err))
            utilsPagination.pagination(data, keySearch, limit, pageIndex, News, res)
        })
    }
}
const createNews = async (req, res) => {
    const { limit, keySearch } = req.query
    const { title, shortDescription, posts, author } = req.body
    const newNews = new News({ title, shortDescription, posts, author })
    newNews.save((err, data) => {
        if (err) return res.json(response.error(err))
        if (keySearch !== "" && title.includes(keySearch)) {  /// name.includes(keySearch)
            News.countDocuments({ title: { $regex: keySearch, $options: 'i' } }, (err1, data1) => {
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
            News.countDocuments({}, (err1, data1) => {
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
const updateNews = (req, res) => {
    const id = req.query.id
    const { title, shortDescription, posts } = req.body
    News.findByIdAndUpdate({ _id: id }, { $set: { title, shortDescription, posts } }, { new: true }).exec((err, data) => {
        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })

}
const deleteNews = async (req, res) => {
    const { id } = req.query
    console.log(req.query);
    News.findByIdAndDelete({ _id: id }).exec(async (err, data) => {
        if (err) return res.json(response.error(err))

        res.json(response.success({ message: `deleted News ${data.name}` }))
    })

}
const getNewsDetail = (req, res) => {
    const { id } = req.params
    News.findById({ _id: id }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))
        News.updateOne({ _id: id }, { views: data.views + 1 }, { new: true }, (err1, data1) => {
            if (err1) return res.json(response.error(err1))
            res.json(response.success(data))
        })

    })
}
module.exports = {
    getNews, createNews, updateNews, deleteNews, getNewsDetail
}
