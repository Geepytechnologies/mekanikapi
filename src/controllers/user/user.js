const { User } = require("../../models/User");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "successful", data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      userID,
      { $set: req.body },
      { new: true }
    );
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUser };
