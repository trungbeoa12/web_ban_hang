const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
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

// [PACTH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    await Product.updateOne({ _id: id }, { status });

    // an toàn: có thì back, không thì về list
    const backURL = req.get("Referrer") || req.get("Referer") || "/admin/products";
    return res.redirect(backURL);
  } catch (error) {
    console.error("changeStatus error:", error);
    return res.status(500).send("Server Error");
  }
};


// [PACTH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = (req.body.type || "").trim();
    const idsRaw = (req.body.ids || "").trim();

    const allowedStatus = new Set(["active", "inactive"]);
    if (!allowedStatus.has(type)) {
      return res.status(400).send("Invalid status type");
    }

    const ids = idsRaw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      const backURL =
        req.get("Referrer") || req.get("Referer") || "/admin/products";
      return res.redirect(backURL);
    }

    await Product.updateMany(
      { _id: { $in: ids }, deleted: false },
      { status: type }
    );

    const backURL =
      req.get("Referrer") || req.get("Referer") || "/admin/products";
    return res.redirect(backURL);
  } catch (error) {
    console.error("changeMulti error:", error);
    return res.status(500).send("Server Error");
  }
};