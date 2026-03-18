const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const slugify = require("slugify");
const cloudinary = require("../../config/cloudinary");

const buildSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title || "", {
    lower: true,
    strict: true,
    locale: "vi"
  });

  let slug = baseSlug;
  let suffix = 0;

  while (true) {
    const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    const exists = await Product.exists(query);
    if (!exists) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
};

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

    // ===== 6. Lấy dữ liệu (sắp xếp theo position) =====
    const products = await Product.find(find)
      .sort({ position: 1 })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    // ===== 7. Render =====
    res.render("admin/pages/products/index", {
      pageTitle: "Danh sach san pham",
      products,
      filterStatus,
      keyword: objectSearch.keyword,
      status: currentStatus,
      pagination: objectPagination,
      message: req.query.message || "",
      type: req.query.type || "success"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// [GET] /admin/products/create
module.exports.create = (req, res) => {
  try {
    res.render("admin/pages/products/create", {
      pageTitle: "Thêm mới sản phẩm",
      message: req.query.message || "",
      type: req.query.type || "success"
    });
  } catch (error) {
    console.error("create product page error:", error);
    res.status(500).send("Server Error");
  }
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id, deleted: false });
    if (!product) {
      return res.redirect("/admin/products?message=Không tìm thấy sản phẩm&type=error");
    }

    res.render("admin/pages/products/edit", {
      pageTitle: "Sửa sản phẩm",
      product,
      message: req.query.message || "",
      type: req.query.type || "success"
    });
  } catch (error) {
    console.error("edit product page error:", error);
    res.status(500).send("Server Error");
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id, deleted: false });
    if (!product) {
      return res.redirect("/admin/products?message=Không tìm thấy sản phẩm&type=error");
    }

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product
    });
  } catch (error) {
    console.error("detail product page error:", error);
    res.status(500).send("Server Error");
  }
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    const { title, description, price, stock, status, position } = req.body;

    if (!title || title.trim().length < 3 || !price || !status) {
      return res.redirect(
        "/admin/products/create?message=Vui lòng nhập đầy đủ Tiêu đề (>= 3 ký tự), Giá > 0 và Trạng thái&type=error"
      );
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock || 0);
    const positionNumber = Number(position || 0);

    try {
      const slug = await buildSlug(title);

      let thumbnailPath = "";
      let thumbnailPublicId = "";

      if (req.file && req.file.buffer) {
        const uploadResult = await cloudinary.uploadBuffer(req.file.buffer, {
          folder: "product-management/products",
          resource_type: "image"
        });
        thumbnailPath = uploadResult.secure_url;
        thumbnailPublicId = uploadResult.public_id;
      }

      await Product.create({
        title,
        description,
        price: isNaN(priceNumber) ? 0 : priceNumber,
        discountPercentage: 0,
        stock: isNaN(stockNumber) ? 0 : stockNumber,
        thumbnail: thumbnailPath,
        thumbnailPublicId,
        status,
        position: isNaN(positionNumber) ? 0 : positionNumber,
        deleted: false,
        deleteAt: null,
        slug
      });

      return res.redirect(
        "/admin/products?message=Thêm sản phẩm mới thành công&type=success"
      );
    } catch (err) {
      // Lỗi trùng slug (tiêu đề trùng gây slug trùng)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
        return res.redirect(
          "/admin/products/create?message=Tiêu đề đã tồn tại, vui lòng chọn tiêu đề khác&type=error"
        );
      }
      console.error("createPost DB error:", err);
      return res.redirect(
        "/admin/products/create?message=Lỗi khi lưu sản phẩm&type=error"
      );
    }
  } catch (error) {
    console.error("createPost error:", error);
    return res.status(500).send("Server Error");
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, price, stock, status, position } = req.body;

    if (!title || title.trim().length < 3 || !price || !status) {
      return res.redirect(
        `/admin/products/edit/${id}?message=Vui lòng nhập đầy đủ Tiêu đề (>= 3 ký tự), Giá > 0 và Trạng thái&type=error`
      );
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock || 0);
    const positionNumber = Number(position || 0);

    const updatedData = {
      title,
      description,
      price: isNaN(priceNumber) ? 0 : priceNumber,
      stock: isNaN(stockNumber) ? 0 : stockNumber,
      status,
      position: isNaN(positionNumber) ? 0 : positionNumber
    };

    const currentProduct = await Product.findOne({ _id: id, deleted: false });
    if (!currentProduct) {
      return res.redirect("/admin/products?message=Không tìm thấy sản phẩm&type=error");
    }

    if (req.file && req.file.buffer) {
      const uploadResult = await cloudinary.uploadBuffer(req.file.buffer, {
        folder: "product-management/products",
        resource_type: "image"
      });
      updatedData.thumbnail = uploadResult.secure_url;
      updatedData.thumbnailPublicId = uploadResult.public_id;

      if (currentProduct.thumbnailPublicId) {
        await cloudinary.destroy(currentProduct.thumbnailPublicId);
      }
    }

    updatedData.slug = await buildSlug(title, id);

    await Product.updateOne({ _id: id }, updatedData);

    return res.redirect("/admin/products?message=Cập nhật sản phẩm thành công&type=success");
  } catch (error) {
    console.error("editPatch error:", error);
    return res.status(500).send("Server Error");
  }
};

// [PACTH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    await Product.updateOne({ _id: id }, { status });
    return res.redirect("/admin/products?message=Thay đổi trạng thái thành công&type=success");
  } catch (error) {
    console.error("changeStatus error:", error);
    return res.status(500).send("Server Error");
  }
};


// [PATCH] /admin/products/change-multi (đổi trạng thái hoặc xóa nhiều)
module.exports.changeMulti = async (req, res) => {
  try {
    const type = (req.body.type || "").trim();
    const idsRaw = (req.body.ids || "").trim();

    const ids = idsRaw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return res.redirect("/admin/products?message=Không có sản phẩm nào được chọn&type=error");
    }

    if (type === "delete") {
      await Product.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true, deleteAt: new Date() }
      );
      return res.redirect("/admin/products?message=Xóa sản phẩm thành công&type=success");
    }

    if (type === "change-position") {
      const position = parseInt(req.body.position, 10);
      const value = isNaN(position) ? 0 : position;
      await Product.updateMany(
        { _id: { $in: ids }, deleted: false },
        { position: value }
      );
      return res.redirect("/admin/products?message=Thay đổi vị trí thành công&type=success");
    }

    const allowedStatus = new Set(["active", "inactive"]);
    if (!allowedStatus.has(type)) {
      return res.redirect("/admin/products?message=Kiểu thay đổi không hợp lệ&type=error");
    }

    await Product.updateMany(
      { _id: { $in: ids }, deleted: false },
      { status: type }
    );

    return res.redirect("/admin/products?message=Thay đổi trạng thái hàng loạt thành công&type=success");
  } catch (error) {
    console.error("changeMulti error:", error);
    return res.status(500).send("Server Error");
  }
};

// [DELETE] /admin/products/delete/:id (soft delete: set deleted = true, deleteAt = now)
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne(
      { _id: id },
      { deleted: true, deleteAt: new Date() }
    );

    return res.redirect("/admin/products?message=Xóa sản phẩm thành công&type=success");
  } catch (error) {
    console.error("deleteItem error:", error);
    return res.status(500).send("Server Error");
  }
};

// [GET] /admin/products/trash - Danh sách sản phẩm đã xóa
module.exports.trash = async (req, res) => {
  try {
    const find = { deleted: true };

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req.query, countProducts, 4);

    const products = await Product.find(find)
      .sort({ deleteAt: -1 })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    res.render("admin/pages/products/trash", {
      pageTitle: "Thùng rác sản phẩm",
      products,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      message: req.query.message || "",
      type: req.query.type || "success"
    });
  } catch (error) {
    console.error("trash error:", error);
    res.status(500).send("Server Error");
  }
};

// [PATCH] /admin/products/restore/:id - Khôi phục sản phẩm
module.exports.restoreItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne(
      { _id: id },
      { deleted: false, deleteAt: null }
    );

    return res.redirect("/admin/products/trash?message=Khôi phục sản phẩm thành công&type=success");
  } catch (error) {
    console.error("restoreItem error:", error);
    return res.status(500).send("Server Error");
  }
};
