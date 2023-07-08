const {
  getAllFeatures,
  createNewFeature,
  getFeaturesCount,
  getFeatureById,
  updateFeature,
  updateFeatureImage,
  deleteFeature,
} = require("../controllers/featuresController");
const verifyToken = require("../middlewares/authinticate");
const imageUpload = require("../middlewares/uploadImage");

const router = require("express").Router();

router.get("/", getAllFeatures);
router.post("/", verifyToken, imageUpload.single("image"), createNewFeature);
router.get("/count", verifyToken, getFeaturesCount);
router.get("/:id", getFeatureById);
router.put("/:id", verifyToken, updateFeature);
router.put(
  "/update-image/:id",
  verifyToken,
  imageUpload.single("image"),
  updateFeatureImage
);
router.delete("/:id", verifyToken, deleteFeature);

module.exports = router;
