const bcrypt = require("bcrypt");
const sendGrid = require("@sendgrid/mail");
const crypto = require("crypto");

const User = require("../models/userModel");
const { API_KEY } = require("../helpers/constants");

sendGrid.setApiKey(API_KEY);

exports.getLogin = (req, res, next) => {
  let message = req.flash("msg");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("login", {
    docTitle: "Login",
    path: req.url,
    _csrf: req.csrfToken(),
    message: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((foundUser) => {
    if (!foundUser) {
      req.flash("msg", "Email does not exist, please signUp first!");
      return res.redirect("/signup");
    }
    bcrypt.compare(password, foundUser.password).then((isSame) => {
      if (!isSame) {
        req.flash("msg", "Incorrect email or password.");
        return res.redirect("/login");
      }
      req.session.user = foundUser;
      req.session.save(() => {
        res.redirect("/");
      });
    });
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("msg");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("signup", {
    docTitle: "SignUp",
    path: req.url,
    _csrf: req.csrfToken(),
    message: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const username = req.body.username ?? "test";
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email,
  }).then((foundUser) => {
    if (foundUser) {
      req.flash("msg", "Email already exists.");
      return res.redirect("/login");
    }
    bcrypt.hash(password, 12).then((encryptedPassword) => {
      const newUser = new User({
        name: username,
        email: email,
        password: encryptedPassword,
      });
      newUser.save().then(() => {
        req.session.user = newUser;
        res.redirect("/");
        sendGrid
          .send({
            from: "sunderkumar2506@gmail.com",
            to: email,
            subject: "Account Created Successfully",
            html: `<h1>This is an h1</h1>`,
            text: "This is test",
          })
          .then(() => {
            console.log("Sent");
          });
      });
    });
  });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("msg");
  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("reset-password", {
    docTitle: "Reset Password",
    path: req.url,
    _csrf: req.csrfToken(),
    message: message,
  });
};

exports.postResetPassword = async (req, res, next) => {
  const email = req.body.email;
  const foundUser = await User.findOne({
    email: email,
  });
  if (!foundUser) {
    req.flash("msg", "Email does not exist.");
    return res.redirect("/reset-password");
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash("msg", "Internal server error, please try again later.");
      res.redirect("/reset-password");
    }
    const bufferString = buffer.toString("hex");
    foundUser.resetPasswordToken = bufferString;
    foundUser.resetPasswordExpiry = Date.now() + 3600000;
    foundUser.save().then(() => {
      sendGrid
        .send({
          from: "sunderkumar2506@gmail.com",
          to: email,
          subject: "Reset Password",
          html: `<h1>http://localhost:3000/reset-password/${bufferString}</h1>`,
          text: "Follow this link to reset your password-",
        })
        .then(() => {
          console.log(`http://localhost:3000/reset-password/${bufferString}`);
        });
    });
  });
  req.flash("msg", "Reset link sent, please check your mail.");
  res.redirect("/reset-password");
};

exports.getNewPassword = async (req, res, next) => {
  const resetToken = req.params.resetToken;
  const foundUser = await User.findOne({
    resetPasswordToken: resetToken,
  });
  if (!foundUser) {
    req.flash("msg", "Invalid link.");
    return res.redirect("/reset-password");
  }

  if (foundUser.resetPasswordExpiry < Date.now()) {
    req.flash("msg", "Link expired, generate a new one.");
    return res.redirect("/reset-password");
  }

  let message = req.flash("msg");
  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("new-password", {
    docTitle: "Reset Password",
    path: req.url,
    _csrf: req.csrfToken(),
    message: message,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const resetToken = req.params.resetToken;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const foundUser = await User.findOne({
    resetPasswordToken: resetToken,
  });
  if (!foundUser) {
    return res.redirect("/404");
  }

  if (foundUser.resetPasswordExpiry < Date.now()) {
    req.flash("msg", "Link expired, generate a new one.");
    return res.redirect("/reset-password");
  }
  const encryptedPassword = await bcrypt.hash(password, 12);
  foundUser.password = encryptedPassword;
  foundUser.resetPasswordExpiry = undefined;
  foundUser.resetPasswordToken = undefined;
  await foundUser.save();
  res.redirect("/login");
};
