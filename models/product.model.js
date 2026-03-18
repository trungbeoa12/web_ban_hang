const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: String,
        slug: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        thumbnailPublicId: String,
        status: String,
        position: Number,
        deleted: Boolean,
        deleteAt: Date
    },
    {
        timestamps: true // createdAt, updatedAt
    }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;
