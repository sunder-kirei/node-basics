const fs = require("fs");
const path = require("path");

class Product {
  id;
  title;

  constructor(title) {
    this.title = title;
    this.id = Date.now().toString();
  }
}

const dataPath = path.join(process.cwd(), "data", "productData.json");

const addProduct = (title) => {
  const newProduct = new Product(title);
  let productList = [];
  fs.readFile(dataPath, (err, data) => {
    if (!err) {
      productList = JSON.parse(data);
    }
    productList.push(newProduct);
    fs.writeFile(dataPath, JSON.stringify(productList), (err) => {
      if (err) console.log(err);
    });
  });

  return;
};

const fetchProductList = (callback) => {
  fs.readFile(dataPath, (err, data) => {
    if (err) return callback([]);
    callback(JSON.parse(data));
  });
};

module.exports = { addProduct: addProduct, fetchProductList: fetchProductList };
