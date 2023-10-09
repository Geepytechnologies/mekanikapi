const { createError } = require("../../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/User");

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
    if (!user) return next(createError(404, "User not found"));
    const isMatched = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatched) return next(createError(400, "wrong credentials"));

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
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET);
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

// const forgotpassword = (req,res)=>{
//   const {data} = req.body
//   try {
//     const

//   } catch (error) {

//   }
// }

module.exports = {
  signup,
  signin,
  signinwithgoogle,
};