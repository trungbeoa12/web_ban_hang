const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get('/', controller.index);
router.get('/trash', controller.trash);
router.get('/create', controller.create);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.patch('/restore/:id', controller.restoreItem);

router.post('/create', controller.createPost);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;