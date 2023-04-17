// mongoDB
const db = require("../helpers/dbHelper");

module.exports = class Cart {
  productId;
  quantity;

  constructor(productId, quantity) {
    this.productId = productId;
    this.quantity = quantity;
  }

  async save() {
    await db.execute("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [
      this.productId,
      this.quantity,
    ]);
  }

  async update(id) {
    await db.execute(
      "UPDATE cart SET product_id = ?, quantity = ? WHERE id = ?",
      [this.productId, this.quantity, id]
    );
  }

  static async fetchAll() {
    const [data] = await db.execute(
      "SELECT * FROM products JOIN cart ON products.id = cart.product_id"
    );
    return data;
  }
};
