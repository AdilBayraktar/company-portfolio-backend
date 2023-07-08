const mongoose = require("mongoose");
const Joi = require("joi");

const TechnologySchema = new mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: true,
      trim: true,
      minlingth: 1,
      maxlingth: 256,
    },
    title_en: {
      type: String,
      required: true,
      trim: true,
      minlingth: 1,
      maxlingth: 256,
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
const validateTechnologyDate = (obj) => {
  const schema = Joi.object({
    title_ar: Joi.string().min(1).max(256).trim().required(),
    title_en: Joi.string().min(1).max(256).trim().required(),
  });
  return schema.validate(obj);
};

const validateUpdateTechnologyDate = (obj) => {
  const schema = Joi.object({
    title_ar: Joi.string().min(1).max(256).trim(),
    title_en: Joi.string().min(1).max(256).trim(),
  });
  return schema.validate(obj);
};

const Technology = mongoose.model("Technology", TechnologySchema);

module.exports = {
  Technology,
  validateTechnologyDate,
  validateUpdateTechnologyDate,
};
