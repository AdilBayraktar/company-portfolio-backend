const asyncHandler = require("express-async-handler");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const fs = require("fs");
const {
  Project,
  validateProjectData,
  validateUpdateProjectData,
} = require("../models/Project");

/**-------------
* @desc Get All Projects
* @router /api/projects
* @method GET
* @access public
-------------*/

const getAllProjects = asyncHandler(async (req, res) => {
  const project = await Project.find();
  res.status(200).json(project);
});

/**-------------
  * @desc Get One Project
  * @router /api/projects/:id
  * @method GET
  * @access public
  -------------*/

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.status(200).json(project);
});

/**-------------
  * @desc Get Projects count
  * @router /api/projects/count
  * @method GET
  * @access private
  -------------*/

const getProjectsCount = asyncHandler(async (req, res) => {
  const projectCount = await Project.count();
  res.status(200).json(projectCount);
});

/**-------------
  * @desc Create Project
  * @router /api/projects
  * @method POST
  * @access private
  -------------*/

const createNewProject = asyncHandler(async (req, res) => {
  //Validate File
  if (!req.file) {
    return res.status(400).json({ message: "No image provided!" });
  }
  //Validate Error
  const { error } = validateProjectData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Upload Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //Create new Service in DB
  const project = await Project.create({
    title_ar: req.body.title_ar,
    title_en: req.body.title_en,
    description_ar: req.body.description_ar,
    description_en: req.body.description_en,
    features: req.body.features,
    technologies: req.body.technologies,
    videoLink: req.body.videoLink,
    projectLink: req.body.projectLink,
    projectType: req.body.projectType,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  //Send Response
  res.status(201).json(project);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
  * @desc Update Feature
  * @router /api/features/:id
  * @method PUT
  * @access private
  -------------*/

const updateProject = asyncHandler(async (req, res) => {
  const { error } = validateUpdateProjectData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const updateProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title_ar: req.body.title_ar,
        title_en: req.body.title_en,
        description_ar: req.body.description_ar,
        description_en: req.body.description_en,
        features: req.body.features,
        technologies: req.body.technologies,
        videoLink: req.body.videoLink,
        projectLink: req.body.projectLink,
        projectType: req.body.projectType,
      },
    },
    { new: true }
  );
  res.status(200).json(updateProject);
});

/**-------------
  * @desc Update Feature Image
  * @router /api/features/update-image/:id
  * @method PUT
  * @access private
  -------------*/

const updateProjectImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Remove old image
  await cloudinaryRemoveImage(project.image.publicId);
  // Upload new Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Update Image in Database
  const updateProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  );
  res.status(200).json(updateProject);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
  * @desc Delete Feature
  * @router /api/features/:id
  * @method DELETE
  * @access private
  -------------*/
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  await Project.findByIdAndDelete(req.params.id);
  await cloudinaryRemoveImage(project.image.publicId);
  res.status(200).json({ message: "Project deleted successfully" });
});

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsCount,
  createNewProject,
  updateProject,
  updateProjectImage,
  deleteProject,
};
