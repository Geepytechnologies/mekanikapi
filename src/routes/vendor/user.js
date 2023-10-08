const express = require("express");
const { getAllUsers, getUserById } = require("../../controllers/vendor/user");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
