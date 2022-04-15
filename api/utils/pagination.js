function getOffset(page, limit) {
    let pageIndex = parseInt(page) < 1 ? 1 : parseInt(page)
    let limitElement = parseInt(limit) < 1 ? 1 : parseInt(limit)
    return (pageIndex - 1) * limitElement
}
function countTotalPage(totalRecord, limit) {
    return Math.ceil(totalRecord / parseInt(limit))
}

function pagination(data, limit, pageIndex, model, filter) {
    let totalRecord
    if (model.length == 0) {
        totalRecord = 1
    } else {
        totalRecord = model.countDocuments(filter || {})
    }

    let totalPage = countTotalPage(totalRecord, limit)
    return {
        limit: parseInt(limit) < 1 ? 1 : parseInt(limit),
        data,
        pageIndex: parseInt(pageIndex) < 1 ? 1 : parseInt(pageIndex),
        totalPage
    }
}
module.exports = {
    getOffset, pagination
}