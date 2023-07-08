const {
  getAllMessages,
  getMessagesCount,
  sendNewMessage,
  getMessageById,
} = require("../controllers/contactController");
const verifyToken = require("../middlewares/authinticate");

const router = require("express").Router();

router.get("/", verifyToken, getAllMessages);
router.get("/count", verifyToken, getMessagesCount);
router.post("/", sendNewMessage);
router.get("/:id", verifyToken, getMessageById);

module.exports = router;
