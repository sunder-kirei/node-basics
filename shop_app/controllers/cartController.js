const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const PDFDocument = require("pdfkit");

const path = require("path");
const fs = require("fs");
const { cwd } = require("process");

//mongoose
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => user.cart.items.map((item) => item.productId))
    .then((data) => {
      res.render("cart", {
        docTitle: "Cart",
        path: req.url,
        productList: data,
      });
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.query.id;
  req.user.addToCart(productId).then(() => res.redirect("/cart"));
};

exports.removeCart = (req, res, next) => {
  const productId = req.query.id;
  req.user.removeFromCart(productId).then(() => res.redirect("/cart"));
};

//model._doc should be used if passing an entire model object into another model
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      return user.cart.items.map((item) => {
        return { product: item.productId._doc, quantity: item.quantity };
      });
    })
    .then((itemList) => {
      const order = new Order({
        items: itemList,
        user: {
          userId: req.user._id,
        },
      });
      return order.save();
    })
    .then((orders) => {
      req.user.cart.items = [];
      req.user.save().then(() => {
        res.redirect("/order/" + orders._id);
      });
    });
};

exports.printOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then((order) => {
    if (
      order === undefined ||
      order.user.userId.toString() !== req.user._id.toString()
    ) {
      return next(new Error());
    }
    const pdf = new PDFDocument();
    pdf.pipe(
      fs.createWriteStream(path.join(cwd(), "orders", `${order._id}.pdf`))
    );
    pdf.pipe(res);
    order.items.forEach((product) => {
      pdf.text(product.product.title);
      pdf.text(product.product.price);
      pdf.text(product.quantity);
      pdf.text("---");
    });
    pdf.end();
  });
};

// mongoDB
// exports.getCart = (req, res, next) => {
//   const userCart = req.user.fetchCart().items.map((item) => {
//     return item._productId;
//   });
//   Product.fetchInList(userCart).then((data) => {
//     if (data === undefined) {
//       data = [];
//     }
//     res.render("cart", {
//       docTitle: "Cart",
//       path: req.url,
//       productList: data,
//     });
//   });
// };

// exports.postCart = (req, res, next) => {
//   const productId = req.query.id;
//   console.log(req.user);
//   req.user.addToCart(productId).then(() => res.redirect("/cart"));
// };

// exports.removeCart = (req, res, next) => {
//   const productId = req.query.id;
//   req.user.removeFromCart(productId).then(() => res.redirect("/cart"));
// };

// exports.postOrder = (req, res, next) => {
//   req.user.addOrder().then(() => res.redirect("/"));
// };

// mysql
// const Cart = require("../models/cartModel");
// exports.getCart = (req, res, next) => {
//   Cart.fetchAll().then((data) =>
//     res.render("cart", {
//       docTitle: "Cart",
//       path: req.url,
//       productList: data,
//     })
//   );
// };

// exports.postCart = (req, res, next) => {
//   const id = req.query.id;
//   const newCart = new Cart(id, 0);
//   newCart.save().then(() => res.redirect("/cart"));
// };
