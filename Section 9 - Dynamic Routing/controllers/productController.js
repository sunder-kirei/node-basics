const productModel = require("../models/Product");

const postProduct = (req, res, _) => {
  const reqBody = req.body;
  productModel.addProduct(
    reqBody.title,
    reqBody.image,
    reqBody.description,
    reqBody.price,
    reqBody.hasId
  );
  res.redirect("/");
  return;
};

const getHome = (req, res, _) => {
  productModel.fetchProductList((productList) =>
    res.render("home-page", {
      docTitle: "EJS | Home",
      path: "/",
      productList: productList,
    })
  );
};

const getAddProduct = (req, res, _) => {
  res.render("add-products", {
    docTitle: "EJS | Add Products",
    path: "/add-products",
    editMode: false,
  });
};

const editProduct = (req, res, _) => {
  productModel.fetchProductList((productList) => {
    const index = productList.findIndex(
      (item) => item.id == req.params.productId
    );
    res.render("add-products", {
      product: productList[index],
      docTitle: "EJS | Add Products",
      path: "/add-products",
      editMode: true,
    });
  });
};

const get404 = (req, res, _) => {
  res.render("404", { docTitle: "Page not found", path: "404" });
};

module.exports = {
  postProduct: postProduct,
  getAddProduct: getAddProduct,
  getHome: getHome,
  get404: get404,
  editProduct: editProduct,
};
