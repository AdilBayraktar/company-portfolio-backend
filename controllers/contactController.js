const asyncHandler = require("express-async-handler");
const { Contact, validateContactData } = require("../models/Contact");
const Mailer = require("nodemailer");

/**-------------
* @desc Get All Messages
* @router /api/messages
* @method GET
* @access private
-------------*/

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find();
  res.status(200).json(messages);
});

/**-------------
* @desc Get Messages Count
* @router /api/messages/count
* @method GET
* @access private
-------------*/

const getMessagesCount = asyncHandler(async (req, res) => {
  const messagesCount = await Contact.count();
  res.status(200).json(messagesCount);
});

/**-------------
* @desc Get One Message
* @router /api/messages/:id
* @method GET
* @access private
-------------*/

const getMessageById = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }
  res.status(200).json(message);
});

/**-------------
* @desc Send a Message
* @router /api/messages
* @method POST
* @access public
-------------*/

const sendNewMessage = asyncHandler(async (req, res) => {
  const { error } = validateContactData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Add to Database
  const message = await Contact.create({
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    message: req.body.message,
  });

  //Return Response
  res.status(200).json(message);
});

module.exports = {
  getAllMessages,
  getMessageById,
  getMessagesCount,
  sendNewMessage,
};
