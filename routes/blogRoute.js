const {
  getAllPosts,
  createNewPost,
  getBlogCount,
  getPostById,
  updatePost,
  updatePostImage,
  deletePost,
} = require("../controllers/blogController");
const verifyToken = require("../middlewares/authinticate");
const imageUpload = require("../middlewares/uploadImage");

const router = require("express").Router();

router.get("/", getAllPosts);
router.post("/", verifyToken, imageUpload.single("image"), createNewPost);
router.get("/count", verifyToken, getBlogCount);
router.get("/:id", getPostById);
router.put("/:id", verifyToken, updatePost);
router.put(
  "/update-image/:id",
  verifyToken,
  imageUpload.single("image"),
  updatePostImage
);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
