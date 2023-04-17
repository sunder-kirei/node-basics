const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");

const dataPath = path.join(process.cwd(), "data", "cartData.json");

module.exports = class Cart {
  productId;
  count;

  static quantity = 0;
  static totalPrice = 0;

  constructor(productId) {
    this.productId = productId;
    this.count = 1;
  }

  static updatePriceAndQuantity(cartData, callback = () => {}) {
    Product.fetchProductList((productList) => {
      let totalPrice = 0;
      let totalQuantity = 0;
      for (let i = 0; i < cartData.length; i++) {
        const product = productList.find(
          (item) => item.id == cartData[i].productId
        );
        if (product) {
          totalPrice += cartData[i].count * +product.price;
          totalQuantity += cartData[i].count;
        }
      }
      Cart.totalPrice = totalPrice;
      Cart.quantity = totalQuantity;
      callback();
    });
  }

  static fetchCart(callback) {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
        callback([]);
      } else {
        callback(JSON.parse(data));
      }
    });
  }

  static addToCart(productId) {
    Cart.fetchCart((cartData) => {
      const index = cartData.findIndex((item) => item.productId == productId);
      if (index != -1) {
        cartData[index].count++;
      } else {
        cartData.push(new Cart(productId));
      }
      fs.writeFile(dataPath, JSON.stringify(cartData), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static removeFromCart(productId) {
    Cart.fetchCart((cartData) => {
      const filteredCart = cartData.filter(
        (item) => item.productId != productId
      );
      fs.writeFile(dataPath, JSON.stringify(filteredCart), (err) => {
        if (err) console.log(err);
      });
    });
  }
};
