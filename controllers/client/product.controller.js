const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");

const attachCategoryInfo = async (products) => {
  const categoryIds = [
    ...new Set(products.map((item) => item.product_category_id).filter(Boolean))
  ];

  if (categoryIds.length === 0) {
    return products.map((item) => ({
      ...item.toObject(),
      category: null,
      priceNew: (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
    }));
  }

  const categories = await ProductCategory.find({
    _id: { $in: categoryIds },
    deleted: false,
    status: "active"
  }).select("title slug");

  const categoryMap = new Map(
    categories.map((item) => [String(item._id), item.toObject()])
  );

  return products.map((item) => ({
    ...item.toObject(),
    category: categoryMap.get(item.product_category_id) || null,
    priceNew: (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
  }));
};

// [GET] /products
module.exports.index = async (req, res) => {
  const find = {
    status: "active",
    deleted: false
  };

  let selectedCategory = null;
  const categorySlug = (req.query.category || "").trim();

  if (categorySlug) {
    selectedCategory = await ProductCategory.findOne({
      slug: categorySlug,
      deleted: false,
      status: "active"
    }).select("_id title slug");

    if (selectedCategory) {
      find.product_category_id = String(selectedCategory._id);
    }
  }

  const products = await Product.find(find);
  const newProducts = await attachCategoryInfo(products);
  const categories = await ProductCategory.find({
    deleted: false,
    status: "active"
  }).sort({ position: 1, title: 1 });

  res.render("client/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: newProducts,
    categories,
    selectedCategory
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await Product.findOne({
    slug,
    status: "active",
    deleted: false
  });

  if (!product) {
    return res.status(404).render("client/pages/products/not-found", {
      pageTitle: "Không tìm thấy sản phẩm"
    });
  }

  const priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);
  const category = product.product_category_id
    ? await ProductCategory.findOne({
      _id: product.product_category_id,
      deleted: false,
      status: "active"
    }).select("title slug")
    : null;

  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product,
    priceNew,
    category
  });
};
