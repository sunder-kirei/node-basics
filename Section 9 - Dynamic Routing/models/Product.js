const db = require("../helpers/databaseHelper");

const addProduct = (title, image, description, price, id) => {
  if (id != "") {
    db.execute(
      `UPDATE products SET title = ?, image = ?, description = ?, price = ? WHERE id = ?`,
      [title, image, description, price, id]
    );
  } else {
    db.execute(
      "INSERT INTO products (title, image, description, price) VALUES (?, ?, ?, ?)",
      [[title, image, description, price]]
    );
  }
  return;
};

const fetchProductList = (callback) => {
  db.execute("SELECT * FROM products").then(([productList]) =>
    callback(productList)
  );
};

module.exports = { addProduct: addProduct, fetchProductList: fetchProductList };
