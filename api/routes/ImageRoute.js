module.exports = (app) => {
  const imageService = require("../services/ImageSevice");
  app
    .route("/image")
    .post(imageService.upload_img_aws)
    .delete(imageService.delete_img_aws)
    .get(imageService.get_img_media);

  app
    .route("/multi-image")
    // .post(imageService.upload_multi_img)
    .post(imageService.upload_multi_img_aws);
};
