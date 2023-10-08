const { getAllUsers, getUserById } = require("../../controllers/user/user");

const express = require("express");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
