const systemConfig = require("../../config/system.js");

const dashboardRouters = require("./dashboard.route.js");
const productRouters = require("./product.route.js");
const productCategoryRouters = require("./product-category.route.js");


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRouters);

    app.use(PATH_ADMIN + "/products", productRouters);
    app.use(PATH_ADMIN + "/product-categories", productCategoryRouters);

}
