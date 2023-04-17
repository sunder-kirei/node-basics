const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  title: String,
  description: String,
  price: {
    type: Number,
    required: true,
  },
  imageUrl: String,
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);

//mongoDB
// const { getDB } = require("../helpers/dbHelper");
// const { ObjectId } = require("mongodb");

// class Product {
//   title;
//   price;
//   imageUrl;
//   description;
//   user;

//   constructor(title, price, imageUrl, description, user) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.user = user;
//   }

//   async save() {
//     try {
//       const db = getDB();
//       const result = await db.collection("products").insertOne(this);
//       console.log(result);
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }

//   static async fetchAll() {
//     try {
//       const db = getDB();
//       const result = await db.collection("products").find().toArray();
//       return result;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }

//   static async fetchById(id) {
//     const _id = new ObjectId(id);
//     const db = getDB();
//     const result = await db.collection("products").findOne({ _id: _id });
//     return result;
//   }

//   static async fetchInList(list) {
//     const db = getDB();
//     return await db
//       .collection("products")
//       .find({
//         _id: {
//           $in: list,
//         },
//       })
//       .toArray();
//   }

//   async update(id) {
//     const _id = new ObjectId(id);
//     const db = getDB();
//     db.collection("products").updateOne(
//       { _id: _id },
//       {
//         $set: {
//           ...this,
//           _id: _id,
//         },
//       }
//     );
//   }
// }
// module.exports = Product;

// mysql
// class Product {
//   title;
//   price;
//   imageUrl;
//   description;

//   constructor(title, price, imageUrl, description) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//   }

//   async save() {
//     await db.execute(
//       "INSERT INTO products (title, price, image_url, description) VALUES (?,?,?,?)",
//       [this.title, this.price, this.imageUrl, this.description]
//     );
//     return;
//   }

//   async update(id) {
//     await db.execute(
//       "UPDATE products SET title = ?, price = ?, image_url = ?, description = ? WHERE id = ?",
//       [this.title, this.price, this.imageUrl, this.description, id]
//     );
//   }

//   static async fetchAll() {
//     const [data] = await db.execute("SELECT * FROM products");
//     return data;
//   }

//   static async fetchById(id) {
//     const [data] = await db.execute("SELECT * FROM products WHERE id = ?", [
//       id,
//     ]);
//     return data[0];
//   }
// }

// module.exports = Product;
