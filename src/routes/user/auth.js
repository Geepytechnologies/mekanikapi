const express = require("express");
const {
  signup,
  signin,
  signinwithgoogle,
  validateaccesstoken,
  forgotpassword,
} = require("../../controllers/user/auth");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signinwithgoogle", signinwithgoogle);

router.post("/validateaccesstoken", validateaccesstoken);

router.post("/forgotpassword", forgotpassword);

module.exports = router;
