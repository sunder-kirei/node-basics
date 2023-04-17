const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");

const path = require("path");

const Product = require("../models/productModel");

// mongoose
exports.getHome = (req, res, next) => {
  Product.find().then((data) => {
    res.render("home-page", {
      productList: data,
      docTitle: "Home Page",
      path: req.url,
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  const id = req.query.id;
  if (id === undefined) {
    res.render("add-products", {
      editMode: false,
      docTitle: "Add Product",
      path: req.url,
      _csrf: req.csrfToken(),
    });
    return;
  }
  Product.findById(id).then((data) => {
    res.render("add-products", {
      editMode: true,
      docTitle: "Edit Product",
      path: req.url,
      product: {
        id: id,
        title: data.title,
        price: data.price,
        image: data.imageUrl,
        description: data.description,
      },
      _csrf: req.csrfToken(),
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  const id = req.query.id;
  const data = req.body;
  if (errors.array().length > 0) {
    return res.status(422).render("add-products", {
      editMode: true,
      docTitle: "Edit Product",
      path: req.url,
      product: {
        id: id,
        title: data.title,
        price: data.price,
        description: data.description,
      },
      _csrf: req.csrfToken(),
    });
  }
  const image = req.file;
  const imagePath = image?.filename;
  if (data.hasId != "") {
    Product.findById(data.hasId)
      .then((product) => {
        product.title = data.title;
        product.price = data.price;
        product.imageUrl = imagePath ?? product.imageUrl;
        product.description = data.description;
        return product.save();
      })
      .then(() => {
        res.redirect("/");
      });
    return;
  }

  const newProduct = new Product({
    title: data.title,
    price: data.price,
    imageUrl: imagePath,
    description: data.description,
    user: new ObjectId(req.user._id),
  });
  newProduct.save().then(() => {
    res.redirect("/");
  });
};

// mongoDB
// exports.getHome = (req, res, next) => {
//   Product.fetchAll().then((data) => {
//     res.render("home-page", {
//       productList: data,
//       docTitle: "Home Page",
//       path: req.url,
//     });
//   });
// };

// exports.getAddProduct = (req, res, next) => {
//   const id = req.query.id;
//   if (id === undefined) {
//     res.render("add-products", {
//       editMode: false,
//       docTitle: "Add Product",
//       path: req.url,
//     });
//     return;
//   }
//   Product.fetchById(id).then((data) => {
//     res.render("add-products", {
//       editMode: true,
//       docTitle: "Edit Product",
//       path: req.url,
//       product: {
//         id: id,
//         title: data.title,
//         price: data.price,
//         image: data.imageUrl,
//         description: data.description,
//       },
//     });
//   });
// };

// exports.postAddProduct = (req, res, next) => {
//   const data = req.body;
//   const newProduct = new Product(
//     data.title,
//     data.price,
//     data.image,
//     data.description,
//     req.user._id
//   );
//   if (data.hasId != "") {
//     newProduct.update(data.hasId).then(() => {
//       res.redirect("/");
//     });
//     return;
//   }

//   newProduct.save().then(() => {
//     res.redirect("/");
//   });
// };
