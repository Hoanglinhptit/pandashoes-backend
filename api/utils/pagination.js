const res = require("express/lib/response")
const response = require("../common/response")
function getOffset(page, limit) {
    let pageIndex = parseInt(page) < 1 ? 1 : parseInt(page)
    let limitElement = parseInt(limit) < 1 ? 1 : parseInt(limit)
    return (pageIndex - 1) * limitElement
}
function countTotalPage(totalRecord, limit) {
    return Math.ceil(totalRecord / parseInt(limit))
}

function pagination(data, keySearch, limit, pageIndex, model, res) {
    let totalRecord

    model.countDocuments(keySearch || {}).exec(async (err, dataCount) => {
        if (err) return err
        totalRecord = dataCount
        let totalPage = countTotalPage(totalRecord, limit)
        // console.log("data res", data)
        res.json(response.success({
            limit: parseInt(limit) < 1 ? 1 : parseInt(limit),
            data,
            keySearch,
            pageIndex: parseInt(pageIndex) < 1 ? 1 : parseInt(pageIndex),
            totalPage
        }))

    })
}

module.exports = {
    getOffset, pagination
}