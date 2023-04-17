const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const moongose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

// mongodb
// const { mongoConnect } = require("./helpers/dbHelper");

// sql
// const db = require("./helpers/dbHelper");

const { CONNECTION_URI } = require("./helpers/constants");

const User = require("./models/userModel");

const admin = require("./routes/admin");
const cart = require("./routes/cart");
const auth = require("./routes/auth");

const app = express();
const csrf = csurf();

const store = new MongoDBStore({
  uri: CONNECTION_URI,
  collection: "sessions",
});

const fileFilter = (req, file, callback) => {
  const mimetype = file.mimetype;
  if (
    mimetype === "image/png" ||
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg"
  ) {
    return callback(null, true);
  }
  return callback(null, false);
};
const storageOptions = multer.diskStorage({
  destination: path.join(__dirname, "images"),
  filename: (req, file, callback) => {
    const fileName = file.originalname
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/gi, "");
    callback(null, `${Date.now()}-${fileName}`);
  },
});

app.set("view engine", "ejs");

app.use(
  session({
    secret: "app-secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
      })
      .then(() => {
        next();
      });
  } else next();
});
app.use((req, res, next) => {
  res.locals.isAuth = req.user ? true : false;
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    storage: storageOptions,
    fileFilter: fileFilter,
  }).single("image")
);

// Should be placed after parsing request body...duh😑😑😑
app.use(csrf);
// Executing flash also calls the next function
app.use(flash());

app.use(admin);
app.use(cart);
app.use(auth);

app.use((req, res, next) => {
  res.render("404", {
    docTitle: "Page not found",
    path: req.url,
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.render("500", {
    docTitle: "Server Error",
    path: req.url,
  });
});

//mongoose
moongose.connect(CONNECTION_URI).then(() => {
  app.listen(3000, () => {
    console.log("Server listening on port : http://localhost:3000/");
  });
});

//mongoDB
// mongoConnect()
//   .then((client) => {
//     app.listen(3000, () => {
//       console.log("Server listening on port: http://localhost:3000/");
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// mysql
// db.sync().then(() => {
//   app.listen(3000, () => {
//     console.log("Server listening on port: http://localhost:3000/");
//   });
// });
