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
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET);

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
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET);
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
