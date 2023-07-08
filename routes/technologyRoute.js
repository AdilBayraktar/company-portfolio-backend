const {
  getAllTech,
  getTechCount,
  getTechById,
  updateTech,
  updateTechImage,
  deleteTech,
  createNewtech,
} = require("../controllers/technologyController");
const verifyToken = require("../middlewares/authinticate");
const imageUpload = require("../middlewares/uploadImage");

const router = require("express").Router();

router.get("/", getAllTech);
router.post("/", verifyToken, imageUpload.single("image"), createNewtech),
  router.get("/count", verifyToken, getTechCount);
router.get("/:id", getTechById);
router.put("/:id", verifyToken, updateTech);
router.put(
  "/update-image/:id",
  verifyToken,
  imageUpload.single("image"),
  updateTechImage
);
router.delete("/:id", verifyToken, deleteTech);

module.exports = router;
