const {
  getAllServices,
  createNewService,
  getServiceById,
  getServicesCount,
  deleteService,
  updateService,
  updateServiceImage,
} = require("../controllers/serviceController");
const verifyToken = require("../middlewares/authinticate");
const imageUpload = require("../middlewares/uploadImage");

const router = require("express").Router();

router.get("/", getAllServices);
router.get("/count", verifyToken, getServicesCount);
router.post("/", verifyToken, imageUpload.single("image"), createNewService);
router.get("/:id", getServiceById);
router.put("/:id", verifyToken, updateService);
router.put(
  "/update-image/:id",
  //
  verifyToken,
  imageUpload.single("image"),
  updateServiceImage
);
router.delete("/:id", verifyToken, deleteService);

module.exports = router;
