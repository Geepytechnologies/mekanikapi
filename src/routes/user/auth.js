const express = require("express");
const {
  signup,
  signin,
  signinwithgoogle,
} = require("../../controllers/user/auth");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signinwithgoogle", signinwithgoogle);

module.exports = router;
