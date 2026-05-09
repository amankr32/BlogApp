const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");

// ==============================
// GET ALL BLOGS
// ==============================
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("user");

    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "No blogs found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { blogs },
        "Blogs fetched successfully"
      )
    );
  } catch (e) {
    console.log("GET ALL BLOGS ERROR:");
    console.log(e);

    return res
      .status(500)
      .json(new ApiError(500, e.message));
  }
};

// ==============================
// ADD BLOG
// ==============================
const addBlog = async (req, res, next) => {
  const { title, desc, img, user } = req.body;

  let session;

  try {
    console.log("REQ BODY:", req.body);

    // Validate required fields
    if (!title || !desc || !img || !user) {
      return res.status(400).json(
        new ApiError(
          400,
          "All fields are required"
        )
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid User ID"));
    }

    // Find Existing User
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res
        .status(404)
        .json(new ApiError(404, "User not found"));
    }

    // Create Blog
    const blog = new Blog({
      title,
      desc,
      img,
      user,
      date: new Date(),
    });

    // Start Mongo Session
    session = await mongoose.startSession();

    session.startTransaction();

    // Save Blog
    await blog.save({ session });

    // Push Blog into User
    existingUser.blogs.push(blog);

    // Save User
    await existingUser.save({ session });

    // Commit Transaction
    await session.commitTransaction();

    session.endSession();

    return res.status(201).json(
      new ApiResponse(
        201,
        { blog },
        "Blog created successfully"
      )
    );
  } catch (e) {
    console.log("ADD BLOG ERROR:");
    console.log(e);

    // Abort transaction safely
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    return res.status(500).json(
      new ApiError(
        500,
        e.message || "Internal Server Error"
      )
    );
  }
};

// ==============================
// UPDATE BLOG
// ==============================
const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;

  const { title, desc } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid Blog ID"));
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        desc,
      },
      { new: true }
    );

    if (!blog) {
      return res
        .status(404)
        .json(new ApiError(404, "Blog not found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { blog },
        "Blog updated successfully"
      )
    );
  } catch (e) {
    console.log("UPDATE BLOG ERROR:");
    console.log(e);

    return res
      .status(500)
      .json(new ApiError(500, e.message));
  }
};

// ==============================
// GET BLOG BY ID
// ==============================
const getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid Blog ID"));
    }

    const blog = await Blog.findById(id).populate("user");

    if (!blog) {
      return res
        .status(404)
        .json(new ApiError(404, "Blog not found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { blog },
        "Blog fetched successfully"
      )
    );
  } catch (e) {
    console.log("GET BLOG BY ID ERROR:");
    console.log(e);

    return res
      .status(500)
      .json(new ApiError(500, e.message));
  }
};

// ==============================
// DELETE BLOG
// ==============================
const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid Blog ID"));
    }

    const blog = await Blog.findByIdAndDelete(id).populate("user");

    if (!blog) {
      return res
        .status(404)
        .json(new ApiError(404, "Blog not found"));
    }

    // Remove blog from user
    const user = blog.user;

    user.blogs.pull(blog._id);

    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Blog deleted successfully"
      )
    );
  } catch (e) {
    console.log("DELETE BLOG ERROR:");
    console.log(e);

    return res
      .status(500)
      .json(new ApiError(500, e.message));
  }
};

// ==============================
// GET BLOGS BY USER ID
// ==============================
const getByUserId = async (req, res, next) => {
  const userId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid User ID"));
    }

    const userBlogs = await User.findById(userId).populate("blogs");

    if (!userBlogs) {
      return res
        .status(404)
        .json(new ApiError(404, "No blogs found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { user: userBlogs },
        "User blogs fetched successfully"
      )
    );
  } catch (e) {
    console.log("GET USER BLOGS ERROR:");
    console.log(e);

    return res
      .status(500)
      .json(new ApiError(500, e.message));
  }
};

module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
};