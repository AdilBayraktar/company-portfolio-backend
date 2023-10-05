const mongoose = require("mongoose");
const Joi = require("joi");

const ProjectSchema = new mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: true,
      trim: true,
      minlingth: 2,
      maxlingth: 256,
    },
    title_en: {
      type: String,
      required: true,
      trim: true,
      minlingth: 2,
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
    features: {
      type: [String],
    },
    technologies: {
      type: [String],
    },
    videoLink: {
      type: String,
      trim: true,
    },
    projectLink: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

//Validate Data
const validateProjectData = (obj) => {
  const schema = Joi.object({
    title_ar: Joi.string().min(2).max(256).trim().required(),
    title_en: Joi.string().min(2).max(256).trim().required(),
    description_ar: Joi.string().min(4).trim().required(),
    description_en: Joi.string().min(4).trim().required(),
    features: Joi.array(),
    technologies: Joi.array(),
    videoLink: Joi.string().allow(""),
    projectLink: Joi.string().allow(""),
    projectType: Joi.string().allow(""),
  });
  return schema.validate(obj);
};

const validateUpdateProjectData = (obj) => {
  const schema = Joi.object({
    title_ar: Joi.string().min(2).max(256).trim(),
    title_en: Joi.string().min(2).max(256).trim(),
    description_ar: Joi.string().min(4).trim(),
    description_en: Joi.string().min(4).trim(),
    features: Joi.array(),
    technologies: Joi.array(),
    videoLink: Joi.string().allow(""),
    projectLink: Joi.string().allow(""),
    projectType: Joi.string().allow(""),
  });
  return schema.validate(obj);
};

const Project = mongoose.model("Project", ProjectSchema);
module.exports = { Project, validateProjectData, validateUpdateProjectData };
