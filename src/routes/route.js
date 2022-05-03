const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController");
const BlogController = require('../controllers/blogController');
const MiddleWare = require('../middlewares/middleWare');


router.post("/createAuthor", AuthorController.createAuthor) // Author APIs /authors //ok

router.post("/createBlog", MiddleWare.authentication, MiddleWare.authorization, BlogController.createBlog ) // POST/blogs //ok

router.get("/getBlog", MiddleWare.authentication, BlogController.getBlog ) // GET/blogs //:id may change //ok

router.put("/updateBlog/:id", MiddleWare.authentication, MiddleWare.authorization2, BlogController.updateBlog ) // PUT/blogs/:blogId //ok

router.delete("/blogDelete/:id", MiddleWare.authentication, MiddleWare.authorization2, BlogController.blogDelete ) //DELETE/blogs/:blogId //ok

router.delete("/deleteBlogByQp", MiddleWare.authentication, BlogController.deleteBlogByQp ) //DELETE/blogs?queryParams //ok


router.post("/userLogin", AuthorController.userLogin ) // POST /login // ok




module.exports = router;