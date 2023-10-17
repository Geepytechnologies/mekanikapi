const {
  getAllUsers,
  getUserById,
  updateUser,
} = require("../../controllers/user/user");

const express = require("express");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;
