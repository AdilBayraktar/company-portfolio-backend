const router = require("express").Router();
const {
  registerUserController,
  loginUserController,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authinticate");

router.post("/register", verifyToken, registerUserController);
router.post("/login", loginUserController);

module.exports = router;
