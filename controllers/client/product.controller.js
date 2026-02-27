const Product = require("../../models/product.model.js")

// [GET] /product

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "inactive",
        deleted: false
    });

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });

    console.log(newProducts);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: newProducts
    });
};