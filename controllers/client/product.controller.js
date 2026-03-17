const Product = require("../../models/product.model.js")

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  });

  const newProducts = products.map(item => {
    item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    return item;
  });

  res.render("client/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: newProducts
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

  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product,
    priceNew
  });
};