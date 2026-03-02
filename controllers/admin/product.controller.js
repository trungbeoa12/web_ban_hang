const Product = require("../../models/product.model");

// [GET] /admin/product
module.exports.index = async (req, res) => {

    // ===== 1. Khởi tạo bộ lọc trạng thái =====
    let filterStatus = [
        { name: "Tất cả", status: "", class: "" },
        { name: "Hoạt động", status: "active", class: "" },
        { name: "Dừng hoạt động", status: "inactive", class: "" },
    ];

    // ===== 2. Xác định trạng thái đang được chọn =====
    const currentStatus = req.query.status || "";

    const index = filterStatus.findIndex(item => item.status === currentStatus);
    if (index !== -1) {
        filterStatus[index].class = "active";
    }

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
        // escape regex để tránh lỗi ký tự đặc biệt
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        find.title = {
            $regex: escapedKeyword,
            $options: "i" // không phân biệt hoa thường
        };
    }

    // ===== 5. Lấy dữ liệu từ database =====
    const products = await Product.find(find);

    // ===== 6. Render view =====
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products,
        filterStatus,
        keyword
    });
};