const mongoose = require("mongoose");

//vendor schemas
const VendorSchema = new mongoose.Schema(
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
    homeaddress: {
      type: String,
    },
    fromgoogle: {
      type: Boolean,
      default: false,
    },
    businessname: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    vendortype: {
      type: String,
      enum: ["dealer", "mechanic"],
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
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
      },
    ],
  },
  { timestamps: true }
);

const MechanicjobsSchema = new mongoose.Schema({
  mechanicid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  vehicleownerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  vechicleid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserVehicle",
  },
  status: {
    type: String,
    enum: ["active", "completed"],
  },
  price: {
    type: String,
  },
  paymentrequestsent: {
    type: Boolean,
    default: false,
  },
});
const MechanicjobrequestsSchema = new mongoose.Schema({
  mechanicid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  vehicleownerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  vechicleid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserVehicle",
  },
  status: {
    type: String,
    enum: ["accepted", "declined"],
  },
  price: {
    type: String,
  },
  paymentrequestsent: {
    type: Boolean,
    default: false,
  },
});

const Vendor = mongoose.model("Vendor", VendorSchema);
const Mechanicjobs = mongoose.model("Mechanicjobs", MechanicjobsSchema);
const Mechanicjobrequests = mongoose.model(
  "Mechanicjobrequests",
  MechanicjobrequestsSchema
);

module.exports = { Vendor, Mechanicjobs, Mechanicjobrequests };
