const asyncHandler = require("express-async-handler");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const fs = require("fs");
const {
  Blog,
  validateBlogData,
  validateUpdateBlogData,
} = require("../models/Blog");

/**-------------
* @desc Get All Posts
* @router /api/blog
* @method GET
* @access public
-------------*/

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Blog.find({}).sort({ createdAt: -1 });
  res.status(200).json(posts);
});

/**-------------
* @desc Get One Post
* @router /api/blog/:id
* @method GET
* @access public
-------------*/

const getPostById = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id });
  if (!blog) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(blog);
});

/**-------------
* @desc Get Posts count
* @router /api/blog/count
* @method GET
* @access private
-------------*/

const getBlogCount = asyncHandler(async (req, res) => {
  const postCount = await Blog.count();
  res.status(200).json(postCount);
});

/**-------------
* @desc Create Post
* @router /api/blog
* @method POST
* @access private
-------------*/

const createNewPost = asyncHandler(async (req, res) => {
  //Validate File
  if (!req.file) {
    return res.status(400).json({ message: "No image provided!" });
  }
  //Validate Error
  const { error } = validateBlogData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Upload Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //Create new Service in DB
  const post = await Blog.create({
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
  res.status(201).json(post);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Update Post
* @router /api/blog/:id
* @method PUT
* @access private
-------------*/

const updatePost = asyncHandler(async (req, res) => {
  const { error } = validateUpdateBlogData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const post = await Blog.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const updatePost = await Blog.findByIdAndUpdate(
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
  res.status(200).json(updatePost);
});

/**-------------
* @desc Update Post Image
* @router /api/blog/update-image/:id
* @method PUT
* @access private
-------------*/

const updatePostImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  const post = await Blog.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Remove old image
  await cloudinaryRemoveImage(post.image.publicId);
  // Upload new Image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Update Image in Database
  const updatePost = await Blog.findByIdAndUpdate(
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
  res.status(200).json(updatePost);

  //Delete Image from local server
  fs.unlinkSync(imagePath);
});

/**-------------
* @desc Delete Post
* @router /api/blog/:id
* @method DELETE
* @access private
-------------*/
const deletePost = asyncHandler(async (req, res) => {
  const post = await Blog.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  await Blog.findByIdAndDelete(req.params.id);
  await cloudinaryRemoveImage(post.image.publicId);
  res.status(200).json({ message: "Post deleted successfully" });
});

module.exports = {
  getAllPosts,
  getPostById,
  getBlogCount,
  createNewPost,
  updatePost,
  deletePost,
  updatePostImage,
};
