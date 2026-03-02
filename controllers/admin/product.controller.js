const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  try {
    // ===== 1. Status =====
    const currentStatus = req.query.status || "";
    const filterStatus = filterStatusHelper(req.query);

    // ===== 2. Query DB =====
    const find = { deleted: false };

    if (currentStatus) {
      find.status = currentStatus;
    }

    // ===== 3. Search =====
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    // ===== 4. Count tổng =====
    const countProducts = await Product.countDocuments(find);

    // ===== 5. Pagination =====
    const objectPagination = paginationHelper(
      req.query,
      countProducts,
      4
    );

    // ===== 6. Lấy dữ liệu =====
    const products = await Product.find(find)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    // ===== 7. Render =====
    res.render("admin/pages/products/index", {
      pageTitle: "Danh sach san pham",
      products,
      filterStatus,
      keyword: objectSearch.keyword,
      status: currentStatus,
      pagination: objectPagination
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};