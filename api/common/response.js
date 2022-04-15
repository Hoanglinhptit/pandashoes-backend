const res = require("express/lib/response")

function wrapErrorJSON(err, message = null) {
    return {
        status: 0,
        code: err.code || 0,
        message: message || err.message,
        data: {}
    }

}
function wrapSuccessJSON(data, message = "success") {
    return {
        status: 1,
        code: 1,
        message: message,
        data
    }
}
module.exports = {
    error: wrapErrorJSON,
    success: wrapSuccessJSON
}