const { createError } = require("../../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Vendor } = require("../../models/Vendormechanic");

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  const existinguser = await Vendor.findOne({ email: email.toLowerCase() });
  const salt = bcrypt.genSaltSync(10);
  const hashedpassword = bcrypt.hashSync(req.body.password, salt);
  try {
    if (existinguser) return next(createError(409, "User already exists"));
    else {
      // Create a new user
      const user = new Vendor({ ...req.body, password: hashedpassword });
      await user.save();

      res.status(201).json(user);
    }
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Vendor.findOne({ email: email.toLowerCase() });
    if (!user) return next(createError(404, "User not found"));
    const isMatched = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatched) return next(createError(400, "wrong credentials"));

    //access Token
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET, {
      expiresIn: "1d",
    });

    const { password, ...others } = user._doc;

    res.status(200).json({ others, accessToken });
  } catch (err) {
    next(err);
  }
};

const signinwithgoogle = async (req, res, next) => {
  try {
    const user = await Vendor.findOne({ email: req.body.email });
    if (user) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "1d" }
      );
      const { password, ...others } = user._doc;

      res.status(200).json({ others, accessToken });
    } else {
      const newUser = new Vendor({ ...req.body, fromgoogle: true });
      await newUser.save();
      const accessToken = jwt.sign(
        { id: newUser.id },
        process.env.ACCESS_SECRET
      );

      const { password, ...others } = newUser;

      res.status(200).json({ others, accessToken });
    }
  } catch (err) {
    next(err);
  }
};

const validateaccesstoken = (req, res) => {
  const accesstoken = req.headers.Authorization || req.headers.authorization;
  try {
    if (accesstoken) {
      const token = accesstoken.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_SECRET, async (err, user) => {
        if (err)
          return res
            .status(403)
            .json({ status: false, message: "Token is not valid!" });
        const myuser = await Vendor.findById(user.id);
        const { password, ...others } = myuser._doc;

        res
          .status(200)
          .json({ status: true, others, message: "Authenticated" });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "You are not authenticated" });
    }
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

const forgotpassword = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await Vendor.findOne({ phone: phone });
    if (!user) return res.status(404).json("User not found");
    const otp = generateOTP();
    const sendsms = sendVerificationSMS(phone, otp);
    if (!sendsms) return res.status(400).json("Error sending OTP message");

    await Vendor.updateOne(
      { _id: user._id },
      { $set: { passwordresetotp: otp } },
      { new: true }
    );
    res.status(200).json("OTP sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const resetpassword = async (req, res) => {
  const { otp, userid } = req.body;
  try {
    const user = await Vendor.findById(userid);
    if (otp !== user.passwordresetotp)
      return res.status(409).json("OTP does not match");
    res.status(200).json("verified");
  } catch (error) {
    res.status(500).json(error);
  }
};

const newpassword = async (req, res) => {
  const { password, userid } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);
    await Vendor.updateOne(
      { _id: userid },
      { $set: { password: hashedpassword } },
      { new: true }
    );
    res.status(200).json("password updated");
  } catch (error) {
    res.status(500).json("Error changing password");
  }
};
module.exports = {
  signup,
  signin,
  signinwithgoogle,
  validateaccesstoken,
  forgotpassword,
  resetpassword,
  newpassword,
};
