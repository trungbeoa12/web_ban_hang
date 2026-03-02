const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/product
module.exports.index = async (req, res) => {

    // ===== 1. Status =====
    const currentStatus = req.query.status || "";

    const filterStatus = filterStatusHelper(req.query);

    // ===== 2. Query DB =====
    let find = {
        deleted: false,
    };

    if (currentStatus) {
        find.status = currentStatus;
    }

    // ===== 3. Search =====
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // ===== 4. Lấy dữ liệu =====
    const products = await Product.find(find);

    // ===== 5. Render =====
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products,
        filterStatus,
        keyword: objectSearch.keyword
    });
};