const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const {
  Technology,
  validateTechnologyDate,
  validateUpdateTechnologyDate,
} = require("../models/Technology");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/**-------------
* @desc Get All Technologies
* @router /api/tech
* @method GET
* @access public
-------------*/

const getAllTech = asyncHandler(async (req, res) => {
  const technologies = await Technology.find();
  res.status(200).json(technologies);
});

/**-------------
* @desc Get One Technology
* @router /api/tech/:id
* @method GET
* @access public
-------------*/

const getTechById = asyncHandler(async (req, res) => {
  const technology = await Technology.findOne({ _id: req.params.id });
  if (!technology) {
    return res.status(404).json({ message: "Technology not found" });
  }
  res.status(200).json(technology);
});

/**-------------
* @desc Get Technologies count
* @router /api/technologies/count
* @method GET
* @access private
-------------*/

const getTechCount = asyncHandler(async (req, res) => {
  const techCount = await Technology.count();
  res.status(200).json(techCount);
});

/**-------------
* @desc Create Technology
* @router /api/tech
* @method POST
* @access private
-------------*/

const createNewtech = asyncHandler(async (req, res) => {
  //Validate File
  if (!req.file) {
    return res.status(400).json({ message: "No image provided!" });
  }
  //Validate Error
  const { error } = validateTechnologyDate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Upload Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //Create new Service in DB
  const technology = await Technology.create({
    title_ar: req.body.title_ar,
    title_en: req.body.title_en,
    description_ar: req.body.description_ar,
    description_en: req.body.description_en,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  //Send Response
  res.status(201).json(technology);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Update Service
* @router /api/tech/:id
* @method PUT
* @access private
-------------*/

const updateTech = asyncHandler(async (req, res) => {
  const { error } = validateUpdateTechnologyDate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const technology = await Technology.findById(req.params.id);
  if (!technology) {
    return res.status(404).json({ message: "Technology not found" });
  }

  const updateTech = await Technology.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title_ar: req.body.title_ar,
        title_en: req.body.title_en,
        description_ar: req.body.description_ar,
        description_en: req.body.description_en,
      },
    },
    { new: true }
  );
  res.status(200).json(updateTech);
});

/**-------------
* @desc Update Technology Image
* @router /api/tech/update-image/:id
* @method PUT
* @access private
-------------*/

const updateTechImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  const technology = await Technology.findById(req.params.id);
  if (!technology) {
    return res.status(404).json({ message: "Technology not found" });
  }

  // Remove old image
  await cloudinaryRemoveImage(technology.image.publicId);
  // Upload new Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Update Image in Database
  const updateTech = await Technology.findByIdAndUpdate(
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
  res.status(200).json(updateTech);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Delete Technology
* @router /api/tech/:id
* @method DELETE
* @access private
-------------*/
const deleteTech = asyncHandler(async (req, res) => {
  const technology = await Technology.findById(req.params.id);
  if (!technology) {
    return res.status(404).json({ message: "Technology not found" });
  }
  await Technology.findByIdAndDelete(req.params.id);
  await cloudinaryRemoveImage(technology.image.publicId);
  res.status(200).json({ message: "Technology deleted successfully" });
});

module.exports = {
  getAllTech,
  getTechById,
  getTechCount,
  createNewtech,
  updateTech,
  updateTechImage,
  deleteTech,
};
