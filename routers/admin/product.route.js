const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");
const uploadCloudinary = require("../../middleware/admin/uploadCloudinary");

router.get('/', controller.index);
router.get('/trash', controller.trash);
router.get('/create', controller.create);
router.get('/debug/cloudinary', controller.debugCloudinary);
router.get('/edit/:id', controller.edit);
router.get('/detail/:id', controller.detail);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.patch('/restore/:id', controller.restoreItem);

router.post(
  '/create',
  uploadCloudinary.single("thumbnail"),
  uploadCloudinary.uploadImage({
    fieldName: "thumbnail",
    folder: "product-management/products",
    buildErrorRedirect: (req, message) =>
      `/admin/products/create?message=${encodeURIComponent(message)}&type=error`
  }),
  controller.createPost
);
router.patch(
  '/edit/:id',
  uploadCloudinary.single("thumbnail"),
  uploadCloudinary.uploadImage({
    fieldName: "thumbnail",
    folder: "product-management/products",
    buildErrorRedirect: (req, message) =>
      `/admin/products/edit/${req.params.id}?message=${encodeURIComponent(message)}&type=error`
  }),
  controller.editPatch
);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;
