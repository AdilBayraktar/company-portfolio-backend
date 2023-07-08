const asyncHandler = require("express-async-handler");
const {
  Service,
  validateServiceData,
  validateUpdateServiceData,
} = require("../models/Service");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const fs = require("fs");

/**-------------
* @desc Get All Services
* @router /api/services
* @method GET
* @access public
-------------*/

const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find();
  res.status(200).json(services);
});

/**-------------
* @desc Get One Service
* @router /api/services/:id
* @method GET
* @access public
-------------*/

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findOne(req.params._id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json(service);
});

/**-------------
* @desc Get Services count
* @router /api/services/count
* @method GET
* @access private
-------------*/

const getServicesCount = asyncHandler(async (req, res) => {
  const serviceCount = await Service.count();
  res.status(200).json(serviceCount);
});

/**-------------
* @desc Create Service
* @router /api/services
* @method POST
* @access private
-------------*/

const createNewService = asyncHandler(async (req, res) => {
  //Validate File
  if (!req.file) {
    return res.status(400).json({ message: "No image provided!" });
  }
  //Validate Error
  const { error } = validateServiceData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Upload Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //Create new Service in DB
  const service = await Service.create({
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
  res.status(201).json(service);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Update Service
* @router /api/services/:id
* @method PUT
* @access private
-------------*/

const updateService = asyncHandler(async (req, res) => {
  const { error } = validateUpdateServiceData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  const updateService = await Service.findByIdAndUpdate(
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
  res.status(200).json(updateService);
});

/**-------------
* @desc Update Service Image
* @router /api/services/update-image/:id
* @method PUT
* @access private
-------------*/

const updateServiceImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  // Remove old image
  await cloudinaryRemoveImage(service.image.publicId);
  // Upload new Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Update Image in Database
  const updateService = await Service.findByIdAndUpdate(
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
  res.status(200).json(updateService);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Delete Service
* @router /api/services/:id
* @method DELETE
* @access private
-------------*/
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  await Service.findByIdAndDelete(req.params.id);
  await cloudinaryRemoveImage(service.image.publicId);
  res.status(200).json({ message: "Service deleted successfully" });
});

module.exports = {
  getAllServices,
  getServiceById,
  createNewService,
  getServicesCount,
  updateService,
  updateServiceImage,
  deleteService,
};
