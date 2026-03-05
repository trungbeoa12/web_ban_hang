const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get('/', controller.index);
router.get('/trash', controller.trash);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.patch('/restore/:id', controller.restoreItem);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;