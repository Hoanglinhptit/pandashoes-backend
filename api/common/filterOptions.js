const response = require('./response')
const pagination = require('../utils/pagination')
exports.filterOptions = (options, pageIndex, limit, Model, res) => {
    try {
        console.log(options);
        Model.find(options, { __v: 0 }).skip(pagination.getOffset(pageIndex, limit)).limit(parseInt(limit))
            .exec((err, data) => {
                if (err) return res.json(response.error(err))
                pagination.pagination(data, options, limit, pageIndex, Model, res)
            })
    } catch (error) {
        return res.json(response.error(error))

    }
}
