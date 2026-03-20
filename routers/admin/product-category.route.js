const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);

router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/edit/:id", controller.editPatch);

router.post("/create", controller.createPost);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
