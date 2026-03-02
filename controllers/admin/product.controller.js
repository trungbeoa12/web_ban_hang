const Product = require("../../models/product.model");

// [GET] /admin/product
module.exports.index = async (req, res) => {   // ✅ thêm async
    const products = await Product.find({
        deleted: false
    });

    console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: products   // ⚠️ nhớ truyền ra view
    });
};