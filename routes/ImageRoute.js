
module.exports = (app) => {
    const ImageService= require('../services/ImageSevice')
    app.route('/upload')
    .post(ImageService.upload_img)
    app.route('/upload-multi')
    .post(ImageService.upload_multi2)
    app.route('/fileName')
    .get(ImageService.download)
}