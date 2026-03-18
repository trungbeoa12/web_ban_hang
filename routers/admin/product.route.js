const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/admin/product.controller")

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', controller.index);
router.get('/trash', controller.trash);
router.get('/create', controller.create);
router.get('/debug/cloudinary', controller.debugCloudinary);
router.get('/edit/:id', controller.edit);
router.get('/detail/:id', controller.detail);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.patch('/restore/:id', controller.restoreItem);

router.post('/create', upload.single("thumbnail"), controller.createPost);
router.patch('/edit/:id', upload.single("thumbnail"), controller.editPatch);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;
