const productRouters = require("./product.route.js");
const productCategoryRouters = require("./product-category.route.js");
const homeRouters = require("./home.route.js");


module.exports = (app) => {
    app.use('/', homeRouters);
    
    app.use('/products', productRouters);
    app.use('/product-categories', productCategoryRouters);
}
