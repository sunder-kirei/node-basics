const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const adminControllers = require("../controllers/adminController");
const isAuth = require("../middlewares/is-auth");

router.get("/", adminControllers.getHome);
router.get("/add-products", isAuth, adminControllers.getAddProduct);
router.post(
  "/add-products",
  isAuth,
  [
    check(
      "title",
      "Invalid title. Should be atleast 3 characters long and atmax 50 characters."
    )
      .trim()
      .isString()
      .isLength({ min: 3, max: 50 }),
    check("price", "Invalid price. Price must be greater than zero.")
      .trim()
      .isNumeric(),
    check("description", "Invalid description.").optional().trim().isString(),
  ],
  adminControllers.postAddProduct
);

module.exports = router;
