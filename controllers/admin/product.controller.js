const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  // ===== 1. Status =====
  const currentStatus = req.query.status || "";
  const filterStatus = filterStatusHelper(req.query);

  // ===== 2. Query DB =====
  const find = { deleted: false };

  if (currentStatus) {
    find.status = currentStatus;
  }

  // ===== 3. Search (REGEX) =====
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // ===== 4. Pagination =====
  const objectPagination = {
    currentPage: 1,
    limitItems: 4,
    skip: 0,
    totalPage: 1
  };

  const page = parseInt(req.query.page, 10);
  if (!Number.isNaN(page) && page > 0) {
    objectPagination.currentPage = page;
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const countProducts = await Product.countDocuments(find);

  // nếu không có sản phẩm thì totalPage vẫn để 1 cho dễ render
  objectPagination.totalPage = Math.max(
    1,
    Math.ceil(countProducts / objectPagination.limitItems)
  );

  // chặn trường hợp page vượt quá totalPage
  if (objectPagination.currentPage > objectPagination.totalPage) {
    objectPagination.currentPage = objectPagination.totalPage;
    objectPagination.skip =
      (objectPagination.currentPage - 1) * objectPagination.limitItems;
  }

  // ===== 5. Lấy dữ liệu =====
  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // ===== 6. Render =====
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products,
    filterStatus,
    keyword: objectSearch.keyword,
    status: currentStatus,
    pagination: objectPagination
  });
};