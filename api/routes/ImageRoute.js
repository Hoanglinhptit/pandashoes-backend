
module.exports = (app) => {
    const imageService = require('../services/ImageSevice')
    app.route('/image')
        .post(imageService.upload_img)

        .delete(imageService.delete_image)
        .get(imageService.get_img_media)
        .delete(imageService.delete_image)


    app.route('/multi-image')
        .post(imageService.upload_multi_img)

}