const ProductCategory = require("../../models/product-category.model");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const slugify = require("slugify");

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
    const exists = await ProductCategory.exists(query);
    if (!exists) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
};

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
  try {
    const currentStatus = req.query.status || "";
    const filterStatus = [
      { name: "Tất cả", status: "", class: currentStatus === "" ? "active" : "" },
      { name: "Hoạt động", status: "active", class: currentStatus === "active" ? "active" : "" },
      { name: "Dừng hoạt động", status: "inactive", class: currentStatus === "inactive" ? "active" : "" }
    ];
    const objectSearch = searchHelper(req.query);

    const find = { deleted: false };

    if (currentStatus) {
      find.status = currentStatus;
    }

    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    const countCategories = await ProductCategory.countDocuments(find);
    const pagination = paginationHelper(req.query, countCategories, 6);

    const categories = await ProductCategory.find(find)
      .sort({ position: 1, createdAt: -1 })
      .limit(pagination.limitItems)
      .skip(pagination.skip);

    res.render("admin/pages/product-categories/index", {
      pageTitle: "Danh mục sản phẩm",
      categories,
      filterStatus,
      keyword: objectSearch.keyword,
      status: currentStatus,
      pagination,
      message: req.query.message || "",
      type: req.query.type || "success"
    });
  } catch (error) {
    console.error("product category index error:", error);
    res.status(500).send("Server Error");
  }
};

// [GET] /admin/product-categories/create
module.exports.create = (req, res) => {
  try {
    res.render("admin/pages/product-categories/create", {
      pageTitle: "Thêm danh mục sản phẩm",
      message: req.query.message || "",
      type: req.query.type || "success"
    });
  } catch (error) {
    console.error("product category create page error:", error);
    res.status(500).send("Server Error");
  }
};

// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;

    if (!title || title.trim().length < 3 || !status) {
      return res.redirect(
        "/admin/product-categories/create?message=Vui lòng nhập tên danh mục ít nhất 3 ký tự và chọn trạng thái&type=error"
      );
    }

    const positionNumber = Number(position || 0);

    await ProductCategory.create({
      title: title.trim(),
      description: description || "",
      slug: await buildSlug(title),
      status,
      position: Number.isNaN(positionNumber) ? 0 : positionNumber,
      deleted: false,
      deleteAt: null
    });

    return res.redirect(
      "/admin/product-categories?message=Thêm danh mục sản phẩm thành công&type=success"
    );
  } catch (error) {
    console.error("product category createPost error:", error);
    return res.redirect(
      "/admin/product-categories/create?message=Lỗi khi lưu danh mục&type=error"
    );
  }
};

// [GET] /admin/product-categories/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!category) {
      return res.redirect(
        "/admin/product-categories?message=Không tìm thấy danh mục&type=error"
      );
    }

    res.render("admin/pages/product-categories/edit", {
      pageTitle: "Sửa danh mục sản phẩm",
      category,
      message: req.query.message || "",
      type: req.query.type || "success"
    });
  } catch (error) {
    console.error("product category edit page error:", error);
    res.status(500).send("Server Error");
  }
};

// [PATCH] /admin/product-categories/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;
    const id = req.params.id;

    if (!title || title.trim().length < 3 || !status) {
      return res.redirect(
        `/admin/product-categories/edit/${id}?message=Vui lòng nhập tên danh mục ít nhất 3 ký tự và chọn trạng thái&type=error`
      );
    }

    const positionNumber = Number(position || 0);

    await ProductCategory.updateOne(
      { _id: id, deleted: false },
      {
        title: title.trim(),
        description: description || "",
        slug: await buildSlug(title, id),
        status,
        position: Number.isNaN(positionNumber) ? 0 : positionNumber
      }
    );

    return res.redirect(
      "/admin/product-categories?message=Cập nhật danh mục thành công&type=success"
    );
  } catch (error) {
    console.error("product category editPatch error:", error);
    return res.redirect(
      `/admin/product-categories/edit/${req.params.id}?message=Lỗi khi cập nhật danh mục&type=error`
    );
  }
};

// [PATCH] /admin/product-categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    await ProductCategory.updateOne(
      { _id: id, deleted: false },
      { status }
    );

    return res.redirect(
      "/admin/product-categories?message=Đổi trạng thái danh mục thành công&type=success"
    );
  } catch (error) {
    console.error("product category changeStatus error:", error);
    return res.redirect(
      "/admin/product-categories?message=Lỗi khi đổi trạng thái danh mục&type=error"
    );
  }
};

// [DELETE] /admin/product-categories/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    await ProductCategory.updateOne(
      { _id: req.params.id, deleted: false },
      {
        deleted: true,
        deleteAt: new Date()
      }
    );

    return res.redirect(
      "/admin/product-categories?message=Đã chuyển danh mục vào trạng thái xóa mềm&type=success"
    );
  } catch (error) {
    console.error("product category deleteItem error:", error);
    return res.redirect(
      "/admin/product-categories?message=Lỗi khi xóa danh mục&type=error"
    );
  }
};
