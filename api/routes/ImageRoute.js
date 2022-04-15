
module.exports = (app) => {
    const imageService = require('../services/ImageSevice')
    app.route('/image')
        .post(imageService.upload_img)
        .get(imageService.get_img)
        .delete(imageService.delete_image)

    app.route('/multiImage')
        .post(imageService.upload_multi_img)

}