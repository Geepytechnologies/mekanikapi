const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    profileimg: {
      type: String,
    },
    refreshtoken: {
      type: String,
      unique: true,
    },
    homeaddress: {
      type: String,
    },
    fromgoogle: {
      type: Boolean,
      default: false,
    },
    pushnotify: {
      type: Boolean,
      default: true,
    },
    emailnotify: {
      type: Boolean,
      default: true,
    },
    usebiometric: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
    },
    purchases: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userpurchases",
    },
  },
  { timestamps: true }
);

const UserpurchaseSchema = new mongoose.Schema({
  itemname: {
    type: String,
  },
  itemid: {
    type: String,
  },
  vendorname: {
    type: String,
  },
  vendorid: {
    type: String,
  },
  price: {
    type: String,
  },
  deliverystatus: {
    type: String,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const UserRepairHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  vehicleid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserVehicle",
  },
  vendorname: {
    type: String,
  },
  vendorid: {
    type: String,
  },
  amountpaid: {
    type: String,
  },
  paymentmethod: {
    type: String,
  },
  repairstatus: {
    type: String,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const UserVehicleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  model: {
    type: String,
  },
  year: {
    type: String,
  },
  regno: {
    type: String,
  },
  vin: {
    type: String,
  },
  image: {
    type: String,
  },
});

const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  amount: {
    type: String,
  },
  date: {
    type: String,
  },
});
const AccountsSchema = new mongoose.Schema({
  bank: {
    type: String,
  },
  accNO: {
    type: String,
  },
  accName: {
    type: String,
  },
});

const Userpurchases = mongoose.model("Userpurchases", UserpurchaseSchema);
const User = mongoose.model("User", UserSchema);
const UserRepairHistory = mongoose.model(
  "UserRepairHistory",
  UserRepairHistorySchema
);
const UserVechicle = mongoose.model("UserVehicle", UserVehicleSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);
const Accounts = mongoose.model("Accounts", AccountsSchema);

module.exports = {
  Userpurchases,
  User,
  UserRepairHistory,
  UserVechicle,
  Transaction,
};
