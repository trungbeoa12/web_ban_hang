const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");

// [GET] /admin/product
module.exports.index = async (req, res) => {

    // ===== 1. Lấy status từ query =====
    const currentStatus = req.query.status || "";

    // ===== 2. Gọi helper =====
    const filterStatus = filterStatusHelper(req.query);

    // ===== 3. Tạo điều kiện query DB =====
    let find = {
        deleted: false,
    };

    if (currentStatus) {
        find.status = currentStatus;
    }

    // ===== 4. Search theo keyword (REGEX) =====
    let keyword = (req.query.keyword || "").trim();

    if (keyword) {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        find.title = {
            $regex: escapedKeyword,
            $options: "i"
        };
    }

    // ===== 5. Lấy dữ liệu =====
    const products = await Product.find(find);

    // ===== 6. Render =====
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products,
        filterStatus,
        keyword
    });
};