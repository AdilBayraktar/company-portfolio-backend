const mongoose = require("mongoose");
const Joi = require("joi");

const ServiceSchema = new mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: true,
      trim: true,
      minlingth: 4,
      maxlingth: 256,
    },
    title_en: {
      type: String,
      required: true,
      trim: true,
      minlingth: 4,
      maxlingth: 256,
    },
    description_ar: {
      type: String,
      required: true,
      trim: true,
      minlingth: 4,
    },
    description_en: {
      type: String,
      required: true,
      trim: true,
      minlingth: 4,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
  },
  { timestamps: true }
);

//Validate Data
const validateServiceData = (obj) => {
  const schema = Joi.object({
    title_ar: Joi.string().min(4).max(256).trim().required(),
    title_en: Joi.string().min(4).max(256).trim().required(),
    description_ar: Joi.string().min(4).trim().required(),
    description_en: Joi.string().min(4).trim().required(),
  });
  return schema.validate(obj);
};

const validateUpdateServiceData = (obj) => {
  const schema = Joi.object({
    title_ar: Joi.string().min(4).max(256).trim(),
    title_en: Joi.string().min(4).max(256).trim(),
    description_ar: Joi.string().min(4).trim(),
    description_en: Joi.string().min(4).trim(),
  });
  return schema.validate(obj);
};

const Service = mongoose.model("Service", ServiceSchema);
module.exports = { Service, validateServiceData, validateUpdateServiceData };
