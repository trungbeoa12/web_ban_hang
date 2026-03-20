const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    description: String,
    status: String,
    position: Number,
    deleted: Boolean,
    deleteAt: Date
  },
  {
    timestamps: true
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema,
  "product-categories"
);

module.exports = ProductCategory;
