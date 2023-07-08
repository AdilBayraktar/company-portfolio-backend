const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");

/**-------------
* @desc Get All Users
* @router /api/users/all
* @method GET
* @access private (Only Admins)
-------------*/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**----------------------------
 * @desc     Get Users Count
 * @route    /api/users/count
 * @method   GET
 * @access   private (Only Admins)
 -----------------------------*/

const getUsersCount = asyncHandler(async (req, res) => {
  const usersCount = await User.count();
  res.status(200).json(usersCount);
});

module.exports = { getAllUsers, getUsersCount };
