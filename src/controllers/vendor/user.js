const { Vendor } = require("../../models/Vendormechanic");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Vendor.find();
    res.status(200).json({ status: "successful", data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await Vendor.findById(userID);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getAllUsers, getUserById };
