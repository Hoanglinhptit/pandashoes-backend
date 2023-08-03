module.exports = (app) => {
  const categoryServices = require("../services/CategoryServices");
  app
    .route("/category")
    .get(categoryServices.getCategory)
    .post(categoryServices.createCategory)
    .put(categoryServices.updatecategory)
    .delete(categoryServices.deleteCategory);
  app.route("/category/:id").get(categoryServices.getCategoryDetail);
};
