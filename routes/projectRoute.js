const {
  getAllProjects,
  createNewProject,
  getProjectsCount,
  getProjectById,
  updateProject,
  updateProjectImage,
  deleteProject,
} = require("../controllers/projectController");
const verifyToken = require("../middlewares/authinticate");
const imageUpload = require("../middlewares/uploadImage");

const router = require("express").Router();

router.get("/", getAllProjects);
router.post("/", verifyToken, imageUpload.single("image"), createNewProject);
router.get("/count", verifyToken, getProjectsCount);
router.get("/:id", getProjectById);
router.put("/:id", verifyToken, updateProject);
router.put(
  "/update-image/:id",
  verifyToken,
  imageUpload.single("image"),
  updateProjectImage
);
router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
