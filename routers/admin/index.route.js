const systemConfig = require("../../config/system.js");

const dashboardRouters = require("./dashboard.route.js");
const productRouters = require("./product.route.js");


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRouters);

    app.use(PATH_ADMIN + "/products", productRouters);

}