const path = require("path");

const express = require("express");

const productController = require("../controllers/productController");

const router = express.Router();

router.get("/add-products", productController.getAddProduct);

router.post("/add-products", productController.postProduct);

router.get("/add-products/:productId", productController.editProduct);

module.exports = router;
