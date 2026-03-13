const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const controller = require("../../controllers/admin/product.controller")

// Cấu hình multer upload ảnh sản phẩm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("public", "uploads", "products"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.get('/', controller.index);
router.get('/trash', controller.trash);
router.get('/create', controller.create);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.patch('/restore/:id', controller.restoreItem);

router.post('/create', upload.single("thumbnail"), controller.createPost);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;