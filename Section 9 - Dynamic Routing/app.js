const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const productController = require("./controllers/productController");
const homePage = require("./routes/home-page");
const addProductsPage = require("./routes/add-products");
const cart = require("./routes/cart");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views", "ejs"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(homePage);
app.use(addProductsPage);
app.use(cart);

app.use(productController.get404);

app.listen(3000, () => {
  console.log("Server started on - http://localhost:3000/");
});
