const { createError } = require("../../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/User");
const { sendVerificationSMS } = require("../../utils/sendverification");

function generateOTP() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  const existinguser = await User.findOne({ email: email.toLowerCase() });
  const salt = bcrypt.genSaltSync(10);
  const hashedpassword = bcrypt.hashSync(req.body.password, salt);
  try {
    if (existinguser) return next(createError(409, "User already exists"));
    else {
      // Create a new user
      const user = new User({ ...req.body, password: hashedpassword });
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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json("User not found");
    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) return res.status(400).json("wrong credentials");

    //access Token
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET);

    //refresh Token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    //save refresh token to the user model
    const updatedUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { refreshtoken: refreshToken },
      { new: true }
    );

    const { password, ...others } = updatedUser._doc;

    res.status(200).json({ others, accessToken });
  } catch (err) {
    next(err);
  }
};

const signinwithgoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "1d" }
      );
      const { password, ...others } = user._doc;

      res.status(200).json({ others, accessToken });
    } else {
      const newUser = new User({ ...req.body, fromgoogle: true });
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
      jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) return res.status(403).json("Token is not valid!");
        res.status(200).json("Authenticated");
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

const forgotpassword = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone: phone });
    if (!user) return res.status(404).json("User not found");
    const otp = generateOTP();
    const sendsms = sendVerificationSMS(phone, otp);
    if (!sendsms) return res.status(400).json("Error sending OTP message");

    await User.updateOne(
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
  try {
  } catch (error) {}
};

module.exports = {
  signup,
  signin,
  signinwithgoogle,
  validateaccesstoken,
  forgotpassword,
};
