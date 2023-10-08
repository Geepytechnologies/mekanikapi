const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    unique: true,
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  amount: {
    type: String,
  },
  paymentstatus: {
    type: String,
  },
});
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: String,
  },
  deliverytimeline: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  details: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Orders = mongoose.model("Orders", OrderSchema);
const Products = mongoose.model("Products", ProductSchema);

module.exports = { Orders, Products };
