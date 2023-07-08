const {
  getAllUsers,
  getUsersCount,
} = require("../controllers/usersController");
const verifyToken = require("../middlewares/authinticate");

const router = require("express").Router();

router.get("/all", verifyToken, getAllUsers);
router.get("/count", verifyToken, getUsersCount);

module.exports = router;
