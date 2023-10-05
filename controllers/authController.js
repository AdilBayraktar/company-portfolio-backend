const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateNewUser, validateLoginUser } = require("../models/user");
const jwt = require("jsonwebtoken");

/**-------------
* @desc Register New User
* @router /api/auth/register
* @method POST
* @access private
-------------*/

const registerUserController = asyncHandler(async (req, res) => {
  const { error } = validateNewUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User Already exist" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    profileImg: req.body.profileImg,
  });

  await user.save();
  res.status(201).json({ message: "User Registered Successfully" });
});

/**-------------
* @desc Login User
* @router /api/auth/login
* @method POST
* @access public
-------------*/

const loginUserController = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    return res.status(400).json({ message: "Invalid UserName or Password" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid UserName or Password" });
  }

  const token = user.generateAuthToken();
  res.status(200).json({
    id: user._id,
    profileImg: user.profileImg,
    userName: user.userName,
    token,
  });
});

module.exports = { registerUserController, loginUserController };
