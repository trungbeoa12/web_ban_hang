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

// [GET] /product-categories
module.exports.index = async (req, res) => {
  try {
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active"
    }).sort({ position: 1, title: 1 });

    const categoryIds = categories.map((item) => String(item._id));
    const products = await Product.find({
      product_category_id: { $in: categoryIds },
      status: "active",
      deleted: false
    }).select("title slug thumbnail product_category_id");

    const productMap = new Map();

    products.forEach((item) => {
      const categoryId = item.product_category_id;
      if (!productMap.has(categoryId)) {
        productMap.set(categoryId, []);
      }

      productMap.get(categoryId).push(item.toObject());
    });

    const categoriesWithPreview = categories.map((item) => ({
      ...item.toObject(),
      products: productMap.get(String(item._id)) || []
    }));

    res.render("client/pages/product-categories/index", {
      pageTitle: "Danh mục sản phẩm",
      categories: categoriesWithPreview
    });
  } catch (error) {
    console.error("client product category index error:", error);
    res.status(500).send("Server Error");
  }
};

// [GET] /product-categories/:slug
module.exports.detail = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slug,
      deleted: false,
      status: "active"
    });

    if (!category) {
      return res.status(404).render("client/pages/products/not-found", {
        pageTitle: "Không tìm thấy danh mục"
      });
    }

    const products = await Product.find({
      product_category_id: String(category._id),
      status: "active",
      deleted: false
    }).sort({ position: 1, createdAt: -1 });

    const categories = await ProductCategory.find({
      deleted: false,
      status: "active"
    }).sort({ position: 1, title: 1 });

    res.render("client/pages/product-categories/detail", {
      pageTitle: category.title,
      category,
      categories,
      products: await attachCategoryInfo(products)
    });
  } catch (error) {
    console.error("client product category detail error:", error);
    res.status(500).send("Server Error");
  }
};
