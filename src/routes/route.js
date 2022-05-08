const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController");
const BlogController = require('../controllers/blogController');
const MiddleWare = require('../middlewares/middleWare');

// To create author
router.post("/authors", AuthorController.createAuthor)

// To Create post
router.post("/blogs", MiddleWare.authentication, MiddleWare.authorization, BlogController.createBlog )

// To fetch blog details
router.get("/blogs", MiddleWare.authentication, BlogController.getBlog )

// To update blog
router.put("/blogs/:blogId", MiddleWare.authentication, MiddleWare.authorization2, BlogController.updateBlog )

// To delete a blog document from prams
router.delete("/blogs/:blogId", MiddleWare.authentication, MiddleWare.authorization2, BlogController.blogDelete )

// To delete blog by query
router.delete("/blogs", MiddleWare.authentication, BlogController.deleteBlogByQp )

// For author login
router.post("/login", AuthorController.userLogin )


module.exports = router;