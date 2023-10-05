const asyncHandler = require("express-async-handler");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const fs = require("fs");
const {
  Features,
  validateFeaturesData,
  validateUpdateFeaturesData,
} = require("../models/Feature");

/**-------------
* @desc Get All Features
* @router /api/features
* @method GET
* @access public
-------------*/

const getAllFeatures = asyncHandler(async (req, res) => {
  const features = await Features.find();
  res.status(200).json(features);
});

/**-------------
* @desc Get One Feature
* @router /api/features/:id
* @method GET
* @access public
-------------*/

const getFeatureById = asyncHandler(async (req, res) => {
  const feature = await Features.findOne({ _id: req.params.id });
  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }
  res.status(200).json(feature);
});

/**-------------
* @desc Get Features count
* @router /api/features/count
* @method GET
* @access private
-------------*/

const getFeaturesCount = asyncHandler(async (req, res) => {
  const featuresCount = await Features.count();
  res.status(200).json(featuresCount);
});

/**-------------
* @desc Create Feature
* @router /api/features
* @method POST
* @access private
-------------*/

const createNewFeature = asyncHandler(async (req, res) => {
  //Validate File
  if (!req.file) {
    return res.status(400).json({ message: "No image provided!" });
  }
  //Validate Error
  const { error } = validateFeaturesData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Upload Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //Create new Service in DB
  const feature = await Features.create({
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
  res.status(201).json(feature);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Update Feature
* @router /api/features/:id
* @method PUT
* @access private
-------------*/

const updateFeature = asyncHandler(async (req, res) => {
  const { error } = validateUpdateFeaturesData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const feature = await Features.findById(req.params.id);
  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  const updateFeature = await Features.findByIdAndUpdate(
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
  res.status(200).json(updateFeature);
});

/**-------------
* @desc Update Feature Image
* @router /api/features/update-image/:id
* @method PUT
* @access private
-------------*/

const updateFeatureImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  const feature = await Features.findById(req.params.id);
  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  // Remove old image
  await cloudinaryRemoveImage(feature.image.publicId);
  // Upload new Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Update Image in Database
  const updateFeature = await Features.findByIdAndUpdate(
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
  res.status(200).json(updateFeature);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Delete Feature
* @router /api/features/:id
* @method DELETE
* @access private
-------------*/
const deleteFeature = asyncHandler(async (req, res) => {
  const feature = await Features.findById(req.params.id);
  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }
  await Features.findByIdAndDelete(req.params.id);
  await cloudinaryRemoveImage(feature.image.publicId);
  res.status(200).json({ message: "Feature deleted successfully" });
});

module.exports = {
  getAllFeatures,
  getFeatureById,
  getFeaturesCount,
  createNewFeature,
  updateFeature,
  updateFeatureImage,
  deleteFeature,
};
