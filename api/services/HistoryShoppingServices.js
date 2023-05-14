const { model } = require('mongoose');
const Bill = model('Bill')
const Product = model('Product')
const User = model('User')
const response = require('../common/response')
const resJson = require('../utils/pagination')
const filterFunction = require('../common/filterOptions')
const moment = require('moment')
const getBill = (req, res) => {
    const { status, pageIndex, limit } = req.query
    Bill.find({ status }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))

        resJson.pagination(data, status, limit, pageIndex, Bill, res, { status })
    }).skip(resJson.getOffset(pageIndex, limit)).limit(parseInt(limit)).populate('user', 'firstName lastName email address createAt updateAt phone')
}
const addBill = (req, res) => {
    const { user, product, payment } = req.body

    let dataReq = {
        user,
        products: JSON.stringify(product),
        payment
    }
    const newBill = new Bill(dataReq)
    newBill.save((err, data) => {
        if (err) return res.json(response.error(err))
        if (data._id) {
            User.findById({ _id: user }, { __v: 0 }, (err1, data1) => {
                if (err1) return res.json(response.error(err1))
                data1.historyShopping.push(data._id)
            })

        }
        res.json(response.success(data))
    })

}

const updateStateBill = (req, res) => {
    const { status } = req.body
    const { id } = req.query
    Bill.findByIdAndUpdate({ _id: id }, { status: status.status }, { new: true }, (err, data) => {

        if (err) return res.json(response.error(err))
        res.json(response.success(data))
    })
}

const deleteBill = (req, res) => {
    const { id } = req.query
    Bill.findByIdAndDelete({ _id: id }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))
        User.findById({ _id: data.user }, { __v: 0 }, (err1, data1) => {
            if (err1) return res.json(response.error(err))
            for (let i = 0; i < data1.historyShopping.length; i++) {
                if (id === data1.historyShopping[i].toString()) {
                    let check = data1.historyShopping.indexOf(data.historyShopping[i])
                    if (check > -1) {
                        data1.historyShopping.splice(check, 1)
                    }
                }
            }
            res.json(response.success(data))
        })
    })

}

const getDetailHistoryUser = async (req, res) => {
    const { id } = req.params
    Bill.findById({ _id: id }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))

        let product = JSON.parse(data.products)
        let arrProduct = []
        for (let i = 0; i < product.length; i++) {
            Product.findById({ _id: product[i].id }, { __v: 0 }, (error, data1) => {
                if (error) return res.json(response.error(error))
                arrProduct.push({

                    id: product[i].id,
                    name: data1.name,
                    image: data1.image,
                    price: product[i].price,
                    quantity: product[i].quantity
                })

                if (i === product.length - 1) {
                    res.json(response.success({

                        _id: data._id,
                        product: arrProduct,
                        payment: data.payment,
                        status: data.status,
                        createAt: moment(data.createdAt).utcOffset(7).format("DD/MM/YYYY hh:mm A"),
                        updateAt: moment(data.updatedAt).utcOffset(7).format("DD/MM/YYYY hh:mm A")
                    }))
                }

            }).populate('image')



        }
    })

}

const getBillsOfUser = (req, res) => {
    const { id, pageIndex, limit } = req.query
    Bill.find({ user: id }, { __v: 0 }, (err, data) => {
        if (err) return res.json(response.error(err))
        resJson.pagination({ ...data, product: JSON.parse(data.product) }, "", limit, pageIndex, Bill, { user: id })

    }).skip(resJson.getOffset(pageIndex, limit)).limit(parseInt(limit))


}
const filterOptions = (req, res) => {
    const { options } = req.body
    const { pageIndex, limit } = req.query
    // filterFunction.filterOptions(options, pageIndex, limit, Bill, res)
    try {
        console.log(options);
        Bill.find(options, { __v: 0 }).skip(resJson.getOffset(pageIndex, limit)).limit(parseInt(limit))
            .exec((err, data) => {
                if (err) return res.json(response.error(err))
                console.log("data", data);
                resJson.pagination(data, options, limit, pageIndex, Bill, res)
            })
    } catch (error) {
        return res.json(response.error(error))

    }
}
const getType = (req, res) => {
    const { type } = req.query
    switch (type) {
        case "admin":
            getBill(req, res)
            break;
        case "user":
            getBillsOfUser(req, res)
            break;

        default:
            getBill(req, res);
    }
}
module.exports = {
    getDetailHistoryUser, getType, addBill, updateStateBill, deleteBill, filterOptions
}