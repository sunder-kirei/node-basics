const path = require("path");

const express = require("express");

const homePage = require("./routes/home-page");
const productsPage = require("./routes/products");
const addProductsPage = require("./routes/add-products");

const app = express();

app.use(express.static(path.join(process.cwd(), "public")));
app.use(homePage);
app.use(productsPage);
app.use(addProductsPage);

app.use((req, res, _) => {
  res.status(404).sendFile(path.join(process.cwd(), "views", "404.html"));
});

app.listen(3000);
