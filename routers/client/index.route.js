const productRouters = require("./product.route.js");
const homeRouters = require("./home.route.js");


module.exports = (app) => {
    app.use('/', homeRouters);
    
    app.use('/products', productRouters);
}