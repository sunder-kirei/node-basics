const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/authController");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [check("email").isEmail().normalizeEmail()],
  authController.postLogin
);

router.get("/signup", authController.getSignUp);
router.post(
  "/signup",
  [
    check("username").trim().isString(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({
      min: 6,
      max: 16,
    }),
  ],
  authController.postSignUp
);

router.get("/logout", isAuth, authController.getLogout);

router.get("/reset-password", authController.getResetPassword);
router.post(
  "/reset-password",
  [check("email").isEmail().normalizeEmail()],
  authController.postResetPassword
);

router.get("/reset-password/:resetToken", authController.getNewPassword);
router.post(
  "/reset-password/:resetToken",
  [
    check("password").isLength({
      min: 6,
      max: 16,
    }),
    check("confirmPassword").custom(
      (value, meta) => meta.req.body.password === value
    ),
  ],
  authController.postNewPassword
);

module.exports = router;
