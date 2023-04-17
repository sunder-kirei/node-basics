const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (_productId) {
  const foundIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === _productId.toString()
  );
  let updatedCartItems;
  if (foundIndex !== -1) {
    updatedCartItems = this.cart.items.map((item, index) => {
      if (index === foundIndex) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
  } else {
    updatedCartItems = this.cart.items;
    updatedCartItems.push({
      productId: _productId,
      quantity: 1,
    });
  }
  this.cart = {
    ...this.cart,
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const filteredCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId;
  });
  this.cart = {
    ...this.cart,
    items: filteredCartItems,
  };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// mongoDB
// const { getDB } = require("../helpers/dbHelper");
// const { ObjectId } = require("mongodb");
// const Product = require("./productModel");

// class User {
//   name;
//   email;
//   cart;
//   _id;

//   constructor(_id, name, email, cart) {
//     this._id = _id;
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//   }

//   async save() {
//     const db = getDB();
//     await db.collection("users").insertOne(this);
//   }

//   static async fetchById(id) {
//     const _id = new ObjectId(id);
//     const db = getDB();
//     const result = await db.collection("users").findOne({ _id: _id });
//     return result;
//   }

//   fetchCart() {
//     return this.cart;
//   }

//   async addToCart(productId) {
//     const _productId = new ObjectId(productId);
//     const foundIndex = this.cart.items.findIndex(
//       (item) => item._productId.toString() === productId.toString()
//     );
//     let updatedCartItems;
//     if (foundIndex !== -1) {
//       updatedCartItems = this.cart.items.map((item, index) => {
//         if (index === foundIndex) {
//           return {
//             ...item,
//             quantity: item.quantity + 1,
//           };
//         }
//         return item;
//       });
//     } else {
//       updatedCartItems = this.cart.items;
//       updatedCartItems.push({
//         _productId: _productId,
//         quantity: 1,
//       });
//     }
//     this.cart = {
//       ...this.cart,
//       items: updatedCartItems,
//     };
//     const db = getDB();
//     await db.collection("users").updateOne(
//       { _id: new ObjectId(this._id) },
//       {
//         $set: {
//           cart: this.cart,
//         },
//       }
//     );
//   }

//   async removeFromCart(productId) {
//     const filteredCartItems = this.cart.items.filter((item) => {
//       return item._productId.toString() !== productId;
//     });
//     this.cart = {
//       ...this.cart,
//       items: filteredCartItems,
//     };
//     const db = getDB();
//     await db.collection("users").updateOne(
//       { _id: new ObjectId(this._id) },
//       {
//         $set: {
//           cart: this.cart,
//         },
//       }
//     );
//   }

//   async addOrder() {
//     if (this.cart.items.length === 0) return;
//     const db = getDB();
//     const cartItemList = this.cart.items.map((item) => item._productId);
//     let productList = await Product.fetchInList(cartItemList);
//     productList.forEach((item) => {
//       const cartItem = this.cart.items.find(
//         (cartItem) => cartItem._productId.toString() === item._id.toString()
//       );
//       item.quantity = cartItem.quantity;
//     });
//     const order = {
//       _userId: new Object(this._id),
//       items: productList,
//     };
//     await db.collection("orders").insertOne(order);
//     this.cart.items = [];
//     await db.collection("users").updateOne(
//       { _id: this._id },
//       {
//         $set: {
//           cart: this.cart,
//         },
//       }
//     );
//   }
// }

// module.exports = User;
