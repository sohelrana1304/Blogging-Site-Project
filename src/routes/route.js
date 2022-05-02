const express = require('express');
const router = express.Router();
const blogController = require("../controllers/blogController")
const authorController = require("../controllers/authorController")
const loginController = require("../controllers/logincontroller")
const middleWare = require("../middleware/middleWare")

router.post('/createAuthor', authorController.createAuthor);

router.post('/authorLogin', loginController.authorLogin);//Login and generate jsonwebtoken

router.post('/createBlogs', middleWare.middlewaree, blogController.createBlogs);

router.get('/getBlogs', middleWare.middlewaree, blogController.getBlogs);

router.put('/updateBlogs/:blogId', middleWare.middlewaree, blogController.updateBlogs);

router.delete('/deleteBlogById/:blogId', middleWare.middlewaree, blogController.deleteBlogByid);

router.delete('/deleteBlogQuery', middleWare.middlewaree, blogController.deleteBlogQuery);
module.exports = router;

