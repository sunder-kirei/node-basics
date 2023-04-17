const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = (req, res, next) => {
  //Add a product to cart
  if (req.query.add) {
    Cart.addToCart(req.query.add);
    res.redirect("/cart");
  }
  //Remove a product from cart
  else if (req.query.remove) {
    Cart.removeFromCart(req.query.remove);
    res.redirect("/cart");
  }
  //If no queries are provided just fetch the cart
  else {
    Cart.fetchCart((cartData) => {
      Product.fetchProductList((productList) => {
        const filteredProducts = productList.filter((product) => {
          const index = cartData.findIndex(
            (cartItem) => cartItem.productId == product.id
          );
          if (index == -1) {
            return false;
          }
          return true;
        });
        Cart.updatePriceAndQuantity(cartData, () => {
          res.render("cart", {
            docTitle: "EJS | Home",
            path: "/cart",
            productList: filteredProducts,
            quantity: Cart.quantity,
            totalPrice: Cart.totalPrice,
          });
        });
      });
    });
  }
};

module.exports = {
  getCart: getCart,
};
