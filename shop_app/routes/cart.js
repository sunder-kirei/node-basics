const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const isAuth = require("../middlewares/is-auth");

router.get("/cart", isAuth, cartController.getCart);
router.get("/cart/add", isAuth, cartController.postCart);
router.get("/cart/remove", isAuth, cartController.removeCart);

router.get("/order", isAuth, cartController.postOrder);
router.get("/order/:orderId", isAuth, cartController.printOrder);

module.exports = router;
