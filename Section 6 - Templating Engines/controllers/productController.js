const productModel = require("../models/Product");

const postProduct = (req, res, _) => {
  productModel.addProduct(req.body.title);
  res.redirect("/products");
  return;
};

const getProduct = (req, res, _) => {
  productModel.fetchProductList((productList) =>
    res.render("products", {
      docTitle: "Pug | Products",
      path: "/products",
      productList: productList,
    })
  );
};

const getAddProduct = (req, res, _) => {
  res.render("add-products", {
    docTitle: "Pug | Add Products",
    path: "/add-products",
  });
};

const getHome = (req, res, _) => {
  res.render("home-page", { docTitle: "Pug | Home", path: "/" });
};

const get404 = (req, res, _) => {
  res.render("404", { docTitle: "Page not found", path: "404" });
};

module.exports = {
  getProduct: getProduct,
  postProduct: postProduct,
  getAddProduct: getAddProduct,
  getHome: getHome,
  get404: get404,
};
