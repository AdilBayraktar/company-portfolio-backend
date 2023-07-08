const mongoose = require("mongoose");
const Joi = require("joi");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 1,
      max: 99,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      min: 4,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 20,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      min: 4,
    },
  },
  { timestamps: true }
);

//Validate Data
const validateContactData = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(99).trim().required(),
    email: Joi.string().min(4).trim().email().required(),
    phone_number: Joi.string().min(6).max(20).trim().required(),
    message: Joi.string().min(4).trim().required(),
  });
  return schema.validate(obj);
};

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = { Contact, validateContactData };
