const express = require("express");
const {
  signup,
  signin,
  signinwithgoogle,
  validateaccesstoken,
} = require("../../controllers/vendor/auth");
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signinwithgoogle", signinwithgoogle);

router.post("/validateaccesstoken", validateaccesstoken);

module.exports = router;
